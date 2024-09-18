import {
  readyServer,
  createPrompt,
  getNodeFunctions,
  sendPrompt,
  subscribeToTask,
} from "@/app/api";
import type { Connection } from "@/types";
import { edgeTypeList } from "@/types";
import {
  addConnection,
  addNode,
  copyConnections,
  copyNodes,
  getTopLeftPoint,
  updateNode,
} from "@/utils";
import { Edge, Node, ReactFlowInstance, ReactFlowJsonObject, applyEdgeChanges, applyNodeChanges } from "reactflow";
import { v4 as uuid } from "uuid";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { AppState } from "@/types/store";
import { transformData } from "@/utils/workflow";
export * from "../types/store";

export const useAppStore = create<AppState>()(
  devtools((set, get) => ({
    page: "flow",
    counter: 0,
    functions: {},
    graph: {},
    results: {},
    edgeType: edgeTypeList[2],
    nodeInProgress: undefined,
    promptError: undefined,
    clientId: undefined,
    
    /******************************************************
     *********************** Base *************************
     ******************************************************/

    onSetPage: (value) => {
      set({ page: value }, false, "onSetPage");
    },

    onNewClientId: (id) => {
      set({ clientId: id }, false, "onNewClientId");
    },
    
    onError: async (error) => {
      set({ promptError: error }, false, "onSubmit");
    },

    onRefresh: async () => {
      const functions = await getNodeFunctions();
      set({ functions }, false, "onRefresh");
    },

    onInit: async (e: ReactFlowInstance) => {
      await readyServer(); // Wait for mock

      const functions = await getNodeFunctions();
      set({ functions }, false, "onInit");

      set({ ...get(), ...e }, false, "onInit");

      // Initialize settings
      // const edgeType = edgeTypeList[parseInt(settings["Comfy.LinkRenderMode"])];
      // get().onEdgesType(edgeType, false);
    },

    /******************************************************
     *********************** Node *************************
     ******************************************************/
    onCreateGroup: () => {
      const { nodes, onDetachGroup } = get();
    },

    onSetNodesGroup: (childIds, groupNode) => {
      set((st) => ({
        nodes: st.nodes.map((n) => {
          if (childIds.includes(n.id)) {
            if (n.parentNode === groupNode.id) return n;
            return {
              ...n,
              parentNode: groupNode.id,
              position: {
                x: n.position.x - groupNode.position.x,
                y: n.position.y - groupNode.position.y,
              },
            };
          } else if (n.parentNode === groupNode.id) {
            return {
              ...n,
              parentNode: undefined,
              position: {
                x: n.position.x + groupNode.position.x,
                y: n.position.y + groupNode.position.y,
              },
            };
          }
          return n;
        }),
      }));
    },

    onDetachGroup: (node) => {
      if (!node.parentNode) return node;
      const nodes = get().nodes;
      const groupNode = nodes.find((n) => n.id === node.parentNode);
      return {
        ...node,
        parentNode: undefined,
        position: {
          x: node.position.x + Number(groupNode?.position.x),
          y: node.position.y + Number(groupNode?.position.y),
        },
      };
    },

    onDetachNodesGroup: (childIds, groupNode) => {
      set((st) => ({
        nodes: st.nodes.map((n) => {
          if (childIds.includes(n.id)) {
            return {
              ...n,
              parentNode: undefined,
              position: {
                x: n.position.x + groupNode.position.x,
                y: n.position.y + groupNode.position.y,
              },
            };
          }
          return n;
        }),
      }));
    },

    onNodesChange: (changes) => {
      set(
        (st) => ({ nodes: applyNodeChanges(changes, st.nodes) }),
        false,
        "onNodesChange"
      );
    },

    onUpdateNodes: (id, data) => {
      set(
        (st) => ({ nodes: updateNode(id, data, st.nodes) }),
        false,
        "onUpdateNodes"
      );
    },

    onAddNode: (nodeItem) => {
      set((st) => addNode(st, nodeItem), false, "onAddNode");
    },

    onDeleteNode: (id) => {
      const { nodes, onDetachNodesGroup } = get();
      const node: any = nodes.find((n) => n.id === id);
      const childIds = nodes
        .filter((n) => n.parentNode === id)
        .map((n) => n.id);
      onDetachNodesGroup(childIds, node);
      set(
        (st) => ({
          nodes: applyNodeChanges([{ type: "remove", id }], st.nodes),
        }),
        false,
        "onDeleteNode"
      );
    },

    onDuplicateNode: (id) => {
      set(
        (st) => {
          const { graph, nodes, widgets } = st;
          const item = graph[id];
          const node = nodes.find((n) => n.id === id);
          const position = node?.position;
          const moved = position
            ? { ...position, y: position.y + (node.height || 100) + 24 }
            : undefined;
          const nodeData = {
            widget: widgets[item.widget],
            name: item.widget,
            node: item,
            position: moved,
            ...(node?.width && { width: node.width }),
            ...(node?.height && { height: node.height }),
          };
          return addNode(st, nodeData);
        },
        false,
        "onDuplicateNode"
      );
    },

    onNodeInProgress: (id, progress) => {
      set({ nodeInProgress: { id, progress } }, false, "onNodeInProgress");
    },

    onPropChange: (id, key, val) => {
      set(
        (st) => {
          st.onUpdateNodes(id, { [key]: val });
          const updatedFields = {
            ...st.graph[id]?.fields,
            [key]: val,
          };
          const updatedNode = {
            ...st.graph[id],
            fields: updatedFields,
          };
          const updatedGraph = {
            ...st.graph,
            [id]: updatedNode,
          };
          return {
            ...st,
            graph: updatedGraph,
          };
        },
        false,
        "onPropChange"
      );
    },

    onModifyChange: (id: string, key: string, value: any) => {
      set((state) => {
        const nodes = state.nodes.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              data: {
                ...node.data,
                [key]: value,
              },
            };
          }
          return node;
        });
        return { nodes };
      });
    },

    onGetNodeFieldsData: (id, key) => {
      try {
        return get()?.graph[id]?.fields[key];
      } catch (e) {
        console.error(e);
      }
    },

    onCopyNode: () => {
      const { nodes } = get();
      const selectedNodes = nodes.filter((n) => n.selected).map((n) => n.id);
      const workflow = instance.toObject();
      const workflowData = selectedNodes.reduce((data: any, id) => {
        const selectNode = instance.getNode(id);
        if (selectNode.parentNode) {
          const groupNode = nodes.find((n) => n.id === selectNode.parentNode);
          data[id] = {
            ...selectNode,
            parentNode: undefined,
            position: {
              x: selectNode.position.x + Number(groupNode?.position.x),
              y: selectNode.position.y + Number(groupNode?.position.y),
            },
          };
        } else {
          data[id] = selectNode;
        }
        return data;
      }, {});
      return {
        data: workflowData,
        connections: workflow.e.filter(
          (e) =>
            selectedNodes.includes(e.target) && selectedNodes.includes(e.source)
        ),
      };
    },

    onPasteNode: (workflow, position) => {
      const basePositon = getTopLeftPoint(
        Object.values(workflow.data).map((item) => item.position)
      );
      const { data, idMap } = copyNodes(workflow, basePositon, position);
      const connections = copyConnections(workflow, idMap);
      const newWorkflow: ReactFlowJsonObject = { data, ...connections };
      set(
        (st) =>
          Object.entries(newWorkflow.data).reduce((state, [key, node]) => {
            const widget = state.widgets[node.value.widget];
            if (widget) {
              return addNode(state, {
                widget,
                name: node.value.widget,
                node: node.value,
                position: node.position,
                width: node.width,
                height: node.height,
                parentNode: node.parentNode,
                key,
              });
            }
            console.warn(`Unknown widget ${node.value.widget}`);
            return state;
          }, connections.connections.reduce(addConnection, st)),
        true,
        "onPasteNode"
      );
    },

    expanded: [],
    onExpand: (id?: string) => {
      const { expanded, graph } = get();
      if (id) {
        // Toggle individual accordion
        const isExpanded = expanded.includes(id);
        set({
          expanded: isExpanded
            ? expanded.filter((itemId) => itemId !== id)
            : [...expanded, id],
        });
      } else {
        // Expand all if any are collapsed, otherwise collapse all
        const allNodeIds = Object.keys(graph);
        const shouldExpandAll = expanded.length !== allNodeIds.length;
        set({
          expanded: shouldExpandAll ? allNodeIds : [],
        });
      }
    },

    /******************************************************
     *********************** Edges *************************
     ******************************************************/

    onEdgesChange: (changes) => {
      set(
        (st) => ({ edges: applyEdgeChanges(changes, st.edges) }),
        false,
        "onEdgesChange"
      );
    },

    onEdgesAnimate: (animated) => {
      set(
        (st) => ({
          edges: st.edges.map((e) => ({ ...e, animated })),
        }),
        false,
        "onEdgesAnimate"
      );
    },

    /******************************************************
     ********************* Settings ***********************
     ******************************************************/

    onUpdateFrontend: async () => {
      // await sendSetting("Comfy.Frontend", "classic");
      window.location.reload();
    },

    onEdgesType: async (edgeType, send = true) => {
      const type = edgeType.name;
      set(
        (st) => ({
          edgeType,
          edges: st.edges.map((e) => ({ ...e, type })),
        }),
        false,
        "onEdgesType"
      );
      // if (send) await sendSetting("Comfy.LinkRenderMode", edgeTypeList.indexOf(edgeType));
    },

    /******************************************************
     ********************* Connection ***********************
     ******************************************************/
    onConnect: (connection) => {
      console.log("onConnect", connection);
      set((st) => addConnection(st, connection), false, "onConnect");
    },

    /******************************************************
     *********************** Prompt *************************
     ******************************************************/

    onSubmit: async () => {
      const res = await sendPrompt(
        createPrompt()
      );
      if (res.task_id) {
        subscribeToTask(res.task_id, state.onTaskUpdate);
        set(
          { counter: state.counter + 1 },
          false,
          "onSubmit"
        );
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
      saveLocalWorkflow(toPersisted(get()), title);
    },

    onLoadLocalWorkflow: (id) => {
      const workflow = getLocalWorkflowFromId(id);
      // if (workflow) {
        get().onLoadWorkflow(workflow);
      // } else {
        // get().onLoadWorkflow(defaultWorkflow);
      // }
    },

    onUpdateLocalWorkFlowGraph: (id) => {
      updateLocalWorkflow(id, { graph: toPersisted(get()) });
    },

    onUpdateLocalWorkFlowTitle: (id, title) => {
      updateLocalWorkflow(id, { title });
    },

    onLoadWorkflow: (workflow) => {
      console.log("[onLoadWorkflow] Received workflow:", workflow);

      if (!workflow) {
        console.error("[onLoadWorkflow] Invalid workflow data");
        return;
      }

      const transformedWorkflow = workflow.data
        ? workflow
        : transformData(workflow, get().widgets);
      console.log("Transformed workflow:", transformedWorkflow);

      set(
        (st) => {
          const { widgets } = st;
          let state: AppState = {
            ...st,
            nodes: [],
            edges: [],
            counter: 0,
            graph: {},
          };

          Object.entries(transformedWorkflow.data).forEach(
            ([key, node]: any) => {
              if (!node.value) {
                console.warn(
                  `[onLoadWorkflow] Node value is undefined or null for key: ${key}`
                );
                return;
              }

              const widget = widgets?.[node.value.widget];
              if (widget) {
                state = addNode(state, {
                  widget,
                  name: node.value.widget,
                  node: node.value,
                  position: node.position,
                  width: node.width,
                  height: node.height,
                  key,
                  parentNode: node.parentNode,
                });
              } else {
                console.warn(
                  `[onLoadWorkflow] Unknown widget: ${node.value.widget}`
                );
              }
            }
          );

          if (transformedWorkflow.connections) {
            transformedWorkflow.connections.forEach(
              (connection: Connection) => {
                state = addConnection(state, connection);
              }
            );
          } else {
            console.warn(
              "[onLoadWorkflow] Workflow connections is undefined or null"
            );
          }

          return state;
        },
        true,
        "onLoadWorkflow"
      );
    },
    onDownloadWorkflow: () => {
      writeWorkflowToFile(toPersisted(get()));
    },
  }))
);
