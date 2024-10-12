import { ReactFlowInstance, addEdge, applyEdgeChanges, applyNodeChanges } from "@xyflow/react";
import { v4 as uuid } from "uuid";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from 'zustand/middleware/immer';

import {
  readyServer,
  getNodeLibrary,
  sendPrompt,
  subscribeToTask,
} from "@/sdbx";
import { AppNode, AppEdge, edgeTypeList, defaultEdge } from "@/types";
import { AppState, AppInstance, AppInstanceMethodKeys } from "@/types/store";

export const useAppStore = create<AppState>()(
  immer(persist(devtools((set, get) => {
    const createInstanceMethod = <T extends AppInstanceMethodKeys>(methodName: T) => {
      return (...args: Parameters<ReactFlowInstance[T]>): ReturnType<ReactFlowInstance[T]> | undefined => {
        const { instance } = get();
        if (!instance) return;
        const method = instance[methodName];
        if (typeof method === 'function') {
          return method.apply(instance, args);
        }
      };
    };

    const getNodeUpdater = (id: string, path: 'modifiable' | 'update') => (value: any) =>
      set((state) => {
        const node = state.nodes.find(n => n.id === id);
        if (node) {
          if (node.data[path]) {
            Object.assign(node.data[path], value);
          } else {
            node.data[path] = value;
          }
        }
      });

    const getNodeMethods = (node: AppNode) => ({ modify: getNodeUpdater(node.id, "modifiable"), update: getNodeUpdater(node.id, "update") })
    
    return {
      library: {},
      results: {},

      nodes: [],
      edges: [],

      theme: "dark",
      toggleTheme: () => { set(state => state.theme = state.theme === "dark" ? "light" : "dark") },

      edgeType: defaultEdge,
      nodeInProgress: undefined,
      promptError: undefined,
      clientId: undefined,

      initialize: async (instance: AppInstance) => {
        await readyServer(); // Wait for mock

        set({ instance }, false, "initialize");
  
        const library = await getNodeLibrary();
        set({ library }, false, "initialize");
    
        // Initialize settings
        // const edgeType = edgeTypeList[parseInt(settings["Comfy.LinkRenderMode"])];
        // get().onEdgesType(edgeType, false);
      },

      hydrate: () => {
        // add modify function back to nodes
        set(state => { state.nodes.forEach(node => Object.assign(node.data, getNodeMethods(node))) }, false, "hydrate")
      },

      setInstance: (instance) => set({ instance }),

      constructNode: ({
        id,
        name,
        fn,
        position = { x: 0, y: 0 },
        width,
        height,
      }) => {
        const { nodes } = get();

        id ??= uuid();
        const fields = fn.inputs.optional;
        const zIndex = Math.max(...nodes.map(n => n.zIndex ?? 0), 0) + 1;
        
        const item: AppNode = {
          id,
          type: name,
          data: { fn, fields, modify: () => {}, update: () => {} },
          dragHandle: ".drag-handle",
          position,
          zIndex,
          width,
          height,
          style: { width, height },
        };

        item.data = { ...item.data, ...getNodeMethods(item) };

        return item;
      },

      getNode: createInstanceMethod('getNode'),
      getNodes: createInstanceMethod('getNodes'),
      addNodes: createInstanceMethod('addNodes'),
      setNodes: createInstanceMethod('setNodes'),
      updateNode: createInstanceMethod('updateNode'),
      updateNodeData: createInstanceMethod('updateNodeData'),

      getEdge: createInstanceMethod('getEdge'),
      getEdges: createInstanceMethod('getEdges'),
      addEdges: createInstanceMethod('addEdges'),
      setEdges: createInstanceMethod('setEdges'),
      updateEdge: createInstanceMethod('updateEdge'),
      updateEdgeData: createInstanceMethod('updateEdgeData'),

      deleteElements: createInstanceMethod('deleteElements'),

      toObject: createInstanceMethod('toObject'),
      toNetworkX: () => {
        const { library, nodes, edges, getNode } = get();

        return {
          directed: true,
          multigraph: true,
          graph: {},
          nodes: nodes.map((node) => {
            const id = node.id;
      
            const fn = library[node.type!];
            const fname = node.data.fn.fname;
        
            const outputs = Object.keys(fn.outputs);
      
            const inputs = Object.values(fn.inputs.required).map(n => n.fname);
            const widget_inputs = Object.keys(fn.inputs.optional).reduce((a, v) => (
              { 
                ...a, 
                [fn.inputs.optional[v].fname]: node.data.fields?.[v]
              }
            ), {}) 
      
            // console.log(widget_inputs);
            // console.log(node);
            
            return {
              id,
              fname,
              outputs,
              inputs,
              widget_inputs,
            }
          }),
          links: edges.map((edge, index: number) => {
            const key = index.toString();
      
            const source = edge.source;
            const target = edge.target;
      
            const sourceNode = library[getNode(source)?.type!];
            const targetNode = library[getNode(target)?.type!];
      
            const sourceHandle = Object.keys(sourceNode.outputs).findIndex(n => n === edge.sourceHandle);
            const targetHandle = targetNode.inputs.required[edge.targetHandle!].fname;
      
            return {
              source,
              target,
              source_handle: sourceHandle,
              target_handle: targetHandle,
              key,
            }
          })
        }
      },

      onNodesChange: (changes) => {
        // https://reactflow.dev/api-reference/utils/apply-node-changes
        set(
          (st) => { st.nodes = applyNodeChanges(changes, st.nodes) as AppNode[] },
          false,
          "onNodesChange"
        );
      },

      onEdgesChange: (changes) => {
        // https://reactflow.dev/api-reference/utils/apply-edge-changes
        set(
          (st) => { st.edges = applyEdgeChanges(changes, st.edges) as AppEdge[] },
          false,
          "onEdgesChange"
        );
      },

      onConnect: (connection) => {
        const oneConnectionPerInput: (item: AppEdge) => boolean = (item) => 
          !(item.targetHandle === connection.targetHandle && item.target === connection.target);

        // https://reactflow.dev/api-reference/utils/add-edge
        set(
          (st) => { st.edges = addEdge(connection, st.edges.filter(oneConnectionPerInput)) },
          false,
          "onConnect"
        );
      },
      
      /******************************************************
       *********************** Base *************************
       ******************************************************/
      
      onError: async (error) => {
        set({ promptError: error }, false, "onSubmit");
      },
      
      onRefresh: async () => {
        const library = await getNodeLibrary();
        set({ library }, false, "onRefresh");
      },
      
      onNewClientId: (id) => {
        set({ clientId: id }, false, "onNewClientId");
      },
  
      /******************************************************
       *********************** Edges *************************
       ******************************************************/
  
      onEdgesAnimate: (animated) => {
        // set(
        //   (st) => ({
        //     edges: st.edges.map((e) => ({ ...e, animated })),
        //   }),
        //   false,
        //   "onEdgesAnimate"
        // );
      },
  
      /******************************************************
       ********************* Settings ***********************
       ******************************************************/
  
      onUpdateFrontend: async () => {
        // await sendSetting("Comfy.Frontend", "classic");
        window.location.reload();
      },
  
      onEdgesType: async (edgeType, send = true) => {
        // const type = edgeType.name;
        // set(
        //   (st) => ({
        //     edgeType,
        //     edges: st.edges.map((e) => ({ ...e, type })),
        //   }),
        //   false,
        //   "onEdgesType"
        // );
        // if (send) await sendSetting("Comfy.LinkRenderMode", edgeTypeList.indexOf(edgeType));
      },
  
      /******************************************************
       *********************** Prompt *************************
       ******************************************************/
  
      onSubmit: async () => {
        const state = get();
        const res = await sendPrompt(state.toNetworkX());
        if (res.task_id) {
          subscribeToTask(res.task_id, state.onTaskUpdate);
          // set(
          //   { counter: state.counter + 1 },
          //   false,
          //   "onSubmit"
          // );
        } else {
          state.onError(res.error ?? "Server didn't report an error. Please check server logs.");
        }
      },
  
      onTaskUpdate: async (data) => {
        const { onError } = get();
        if (data.results) {
          set(
            { results: data.results },
            false,
            "onTaskUpdate"
          )
  
          if (data.completion) {
            console.log(`${data.task_id} completed`)
          }
        } else {
          onError(data.error ?? "Server didn't report an error. Please check server logs.")
        }
      },
  
      /******************************************************
       ***************** Workflow && Persist *******************
       ******************************************************/
  
      onSaveLocalWorkFlow: (title) => {
        // saveLocalWorkflow(toPersisted(get()), title);
      },
  
      onLoadLocalWorkflow: (id) => {
        // const workflow = getLocalWorkflowFromId(id);
        // if (workflow) {
          // get().onLoadWorkflow(workflow);
        // } else {
          // get().onLoadWorkflow(defaultWorkflow);
        // }
      },
  
      onUpdateLocalWorkFlowGraph: (id) => {
        // updateLocalWorkflow(id, { graph: toPersisted(get()) });
      },
  
      onUpdateLocalWorkFlowTitle: (id, title) => {
        // updateLocalWorkflow(id, { title });
      },
  
      onLoadWorkflow: (workflow) => {
        // console.log("[onLoadWorkflow] Received workflow:", workflow);
  
        // if (!workflow) {
        //   console.error("[onLoadWorkflow] Invalid workflow data");
        //   return;
        // }
  
        // const transformedWorkflow = workflow.data
        //   ? workflow
        //   : transformData(workflow, get().widgets);
        // console.log("Transformed workflow:", transformedWorkflow);
  
        // set(
        //   (st) => {
        //     const { widgets } = st;
        //     let state: AppState = {
        //       ...st,
        //       nodes: [],
        //       edges: [],
        //       counter: 0,
        //       graph: {},
        //     };
  
        //     Object.entries(transformedWorkflow.data).forEach(
        //       ([key, node]: any) => {
        //         if (!node.value) {
        //           console.warn(
        //             `[onLoadWorkflow] Node value is undefined or null for key: ${key}`
        //           );
        //           return;
        //         }
  
        //         const widget = widgets?.[node.value.widget];
        //         if (widget) {
        //           state = addNode(state, {
        //             widget,
        //             name: node.value.widget,
        //             node: node.value,
        //             position: node.position,
        //             width: node.width,
        //             height: node.height,
        //             key,
        //             parentNode: node.parentNode,
        //           });
        //         } else {
        //           console.warn(
        //             `[onLoadWorkflow] Unknown widget: ${node.value.widget}`
        //           );
        //         }
        //       }
        //     );
  
        //     if (transformedWorkflow.connections) {
        //       transformedWorkflow.connections.forEach(
        //         (connection: Connection) => {
        //           state = addConnection(state, connection);
        //         }
        //       );
        //     } else {
        //       console.warn(
        //         "[onLoadWorkflow] Workflow connections is undefined or null"
        //       );
        //     }
  
        //     return state;
        //   },
        //   true,
        //   "onLoadWorkflow"
        // );
      },

      onDownloadWorkflow: () => {
        // writeWorkflowToFile(toPersisted(get()));
      },
    }}),
    {
      name: "singularity-graph",
      onRehydrateStorage: (state) => { return (state, error) => state?.hydrate() }
    }
  ))
)