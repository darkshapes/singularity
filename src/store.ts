import { ReactFlowInstance, addEdge, applyEdgeChanges, applyNodeChanges } from "@xyflow/react";
import { v4 as uuid } from "uuid";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

import {
  readyServer,
  getNodeFunctions,
  sendPrompt,
  subscribeToTask,
} from "@/sdbx";
import { AppNode, AppEdge, edgeTypeList, defaultEdge } from "@/types";
import { AppState, AppInstance, AppInstanceMethodKeys } from "@/types/store";

export const useAppStore = create<AppState>()(
  devtools((set, get) => {
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
    
    return {
      functions: {},
      results: {},

      nodes: [],
      edges: [],

      theme: "dark",
      toggleTheme: () => { set({ theme: get().theme === "dark" ? "light" : "dark" }) },

      edgeType: defaultEdge,
      nodeInProgress: undefined,
      promptError: undefined,
      clientId: undefined,

      initialize: async (instance: AppInstance) => {
        await readyServer(); // Wait for mock

        set({ instance }, false, "initialize");
  
        const functions = await getNodeFunctions();
        set({ functions }, false, "initialize");
    
        // Initialize settings
        // const edgeType = edgeTypeList[parseInt(settings["Comfy.LinkRenderMode"])];
        // get().onEdgesType(edgeType, false);
      },

      setInstance: (instance) => set({ instance }),

      constructNode: ({
        id,
        name,
        fn,
        fields,
        modify,
        position = { x: 0, y: 0 },
        width,
        height,
      }) => {
        const { nodes } = get();

        id ??= uuid();
        fields = fn.inputs.optional

        const zIndex = Math.max(...nodes.map(n => n.zIndex ?? 0), 0) + 1;
        
        const item: AppNode = {
          id,
          type: name,
          data: {
            fn,
            fields,
            modify,
          },
          dragHandle: ".drag-handle",
          position,
          zIndex,
          width,
          height,
          style: { width, height },
        };

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
        const { functions, nodes, edges, getNode } = get();

        return {
          directed: true,
          multigraph: true,
          graph: {},
          nodes: nodes.map((node) => {
            const id = node.id;
      
            const fn = functions[node.type!];
            const fname = node.data.fn.fname;
        
            const outputs = Object.keys(fn.outputs);
      
            const inputs = Object.values(fn.inputs.required).map(n => n.fname);
            const widget_inputs = Object.keys(fn.inputs.optional).reduce((a, v) => (
              { 
                ...a, 
                [fn.inputs.optional[v].fname]: node.data.fields[v]
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
      
            const sourceNode = functions[getNode(source)?.type!];
            const targetNode = functions[getNode(target)?.type!];
      
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
          (st) => ({ nodes: applyNodeChanges(changes, st.nodes) }),
          false,
          "onNodesChange"
        );
      },

      onEdgesChange: (changes) => {
        // https://reactflow.dev/api-reference/utils/apply-edge-changes
        set(
          (st) => ({ edges: applyEdgeChanges(changes, st.edges) }),
          false,
          "onEdgesChange"
        );
      },

      onConnect: (connection) => {
        const oneConnectionPerInput: (item: AppEdge) => boolean = (item) => 
          !(item.targetHandle === connection.targetHandle && item.target === connection.target);

        // https://reactflow.dev/api-reference/utils/add-edge
        set(
          (st) => ({ edges: addEdge(connection, st.edges.filter(oneConnectionPerInput)) }),
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
        const functions = await getNodeFunctions();
        set({ functions }, false, "onRefresh");
      },
      
      onNewClientId: (id) => {
        set({ clientId: id }, false, "onNewClientId");
      },

      /******************************************************
       *********************** Node *************************
       ******************************************************/
      onCreateGroup: () => {
        // const { nodes, onDetachGroup } = get();
      },
  
      onSetNodesGroup: (childIds, groupNode) => {
        // set((st) => ({
        //   nodes: st.nodes.map((n) => {
        //     if (childIds.includes(n.id)) {
        //       if (n.parentNode === groupNode.id) return n;
        //       return {
        //         ...n,
        //         parentNode: groupNode.id,
        //         position: {
        //           x: n.position.x - groupNode.position.x,
        //           y: n.position.y - groupNode.position.y,
        //         },
        //       };
        //     } else if (n.parentNode === groupNode.id) {
        //       return {
        //         ...n,
        //         parentNode: undefined,
        //         position: {
        //           x: n.position.x + groupNode.position.x,
        //           y: n.position.y + groupNode.position.y,
        //         },
        //       };
        //     }
        //     return n;
        //   }),
        // }));
      },
  
      onDetachGroup: (node) => {
        // if (!node.parentNode) return node;
        // const nodes = get().nodes;
        // const groupNode = nodes.find((n) => n.id === node.parentNode);
        // return {
        //   ...node,
        //   parentNode: undefined,
        //   position: {
        //     x: node.position.x + Number(groupNode?.position.x),
        //     y: node.position.y + Number(groupNode?.position.y),
        //   },
        // };
        return node;
      },
  
      onDetachNodesGroup: (childIds, groupNode) => {
        // set((st) => ({
        //   nodes: st.nodes.map((n) => {
        //     if (childIds.includes(n.id)) {
        //       return {
        //         ...n,
        //         parentNode: undefined,
        //         position: {
        //           x: n.position.x + groupNode.position.x,
        //           y: n.position.y + groupNode.position.y,
        //         },
        //       };
        //     }
        //     return n;
        //   }),
        // }));
      },
  
      onUpdateNodes: (id, data) => {
        // set(
        //   (st) => ({ nodes: updateNode(id, data, st.nodes) }),
        //   false,
        //   "onUpdateNodes"
        // );
      },
  
      onDuplicateNode: (id) => {
        // set(
        //   (st) => {
        //     const item = st.getNode(id);
        //     const node = nodes.find((n) => n.id === id);
        //     const position = node?.position;
        //     const moved = position
        //       ? { ...position, y: position.y + (node.height || 100) + 24 }
        //       : undefined;
        //     const nodeData = {
        //       widget: widgets[item.widget],
        //       name: item.widget,
        //       node: item,
        //       position: moved,
        //       ...(node?.width && { width: node.width }),
        //       ...(node?.height && { height: node.height }),
        //     };
        //     return addNode(st, nodeData);
        //   },
        //   false,
        //   "onDuplicateNode"
        // );
      },
  
      onNodeInProgress: (id, progress) => {
        // set({ nodeInProgress: { id, progress } }, false, "onNodeInProgress");
      },
  
      onPropChange: (id, key, val) => {
        // set(
        //   (st) => {
        //     st.onUpdateNodes(id, { [key]: val });
        //     const updatedFields = {
        //       ...st.graph[id]?.fields,
        //       [key]: val,
        //     };
        //     const updatedNode = {
        //       ...st.graph[id],
        //       fields: updatedFields,
        //     };
        //     const updatedGraph = {
        //       ...st.graph,
        //       [id]: updatedNode,
        //     };
        //     return {
        //       ...st,
        //       graph: updatedGraph,
        //     };
        //   },
        //   false,
        //   "onPropChange"
        // );
      },
  
      onModifyChange: (id: string, key: string, value: any) => {
        // set((state) => {
        //   const nodes = state.nodes.map((node) => {
        //     if (node.id === id) {
        //       return {
        //         ...node,
        //         data: {
        //           ...node.data,
        //           [key]: value,
        //         },
        //       };
        //     }
        //     return node;
        //   });
        //   return { nodes };
        // });
      },
  
      onGetNodeFieldsData: (id, key) => {
        // try {
        //   return get()?.graph[id]?.fields[key];
        // } catch (e) {
        //   console.error(e);
        // }
      },
  
      onCopyNode: () => {
        // const { nodes } = get();
        // const selectedNodes = nodes.filter((n) => n.selected).map((n) => n.id);
        // const workflow = instance.toObject();
        // const workflowData = selectedNodes.reduce((data: any, id) => {
        //   const selectNode = instance.getNode(id);
        //   if (selectNode.parentNode) {
        //     const groupNode = nodes.find((n) => n.id === selectNode.parentNode);
        //     data[id] = {
        //       ...selectNode,
        //       parentNode: undefined,
        //       position: {
        //         x: selectNode.position.x + Number(groupNode?.position.x),
        //         y: selectNode.position.y + Number(groupNode?.position.y),
        //       },
        //     };
        //   } else {
        //     data[id] = selectNode;
        //   }
        //   return data;
        // }, {});
        // return {
        //   data: workflowData,
        //   connections: workflow.e.filter(
        //     (e) =>
        //       selectedNodes.includes(e.target) && selectedNodes.includes(e.source)
        //   ),
        // };
      },
  
      onPasteNode: (workflow, position) => {
        // const basePositon = getTopLeftPoint(
        //   Object.values(workflow.data).map((item) => item.position)
        // );
        // const { data, idMap } = copyNodes(workflow, basePositon, position);
        // const connections = copyConnections(workflow, idMap);
        // const newWorkflow: ReactFlowJsonObject = { data, ...connections };
        // set(
        //   (st) =>
        //     Object.entries(newWorkflow.data).reduce((state, [key, node]) => {
        //       const widget = state.widgets[node.value.widget];
        //       if (widget) {
        //         return addNode(state, {
        //           widget,
        //           name: node.value.widget,
        //           node: node.value,
        //           position: node.position,
        //           width: node.width,
        //           height: node.height,
        //           parentNode: node.parentNode,
        //           key,
        //         });
        //       }
        //       console.warn(`Unknown widget ${node.value.widget}`);
        //       return state;
        //     }, connections.connections.reduce(addConnection, st)),
        //   true,
        //   "onPasteNode"
        // );
      },
  
      expanded: [],
      onExpand: (id?: string) => {
        // const { expanded, graph } = get();
        // if (id) {
        //   // Toggle individual accordion
        //   const isExpanded = expanded.includes(id);
        //   set({
        //     expanded: isExpanded
        //       ? expanded.filter((itemId) => itemId !== id)
        //       : [...expanded, id],
        //   });
        // } else {
        //   // Expand all if any are collapsed, otherwise collapse all
        //   const allNodeIds = Object.keys(graph);
        //   const shouldExpandAll = expanded.length !== allNodeIds.length;
        //   set({
        //     expanded: shouldExpandAll ? allNodeIds : [],
        //   });
        // }
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
    }})
)