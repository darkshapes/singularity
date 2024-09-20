import { createStore } from 'zustand';
import { Edge, ReactFlowInstance, ReactFlowJsonObject, OnConnect, OnEdgesChange, OnNodesChange } from "reactflow";
import type {
  AppEdge,
  AppNode,
  EdgeType,
  NodeData,
  NodeFunction,
  NodeFunctionKey,
  NodeId,
  NodeInProgress,
  NodeItem,
  PropertyKey,
} from "@/types";

export type OnPropChange = (
  id: NodeId,
  property: PropertyKey,
  value: any
) => void;

export type AppInstance = ReactFlowInstance<NodeData>;

type MethodKeys<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

export type AppInstanceMethodKeys = MethodKeys<AppInstance>;

export type AppState = {
  instance?: AppInstance;
  setInstance: (instance: ReactFlowInstance) => void;

  functions: Record<NodeFunctionKey, NodeFunction>;
  results: Record<NodeId, any>;

  nodes: AppNode[];
  edges: Edge[];

  edgeType: EdgeType;
  nodeInProgress?: NodeInProgress;
  promptError?: string;
  clientId?: string;
  
  initialize: (instance: AppInstance) => Promise<void>;

  constructNode: (item: NodeItem) => AppNode;

  onError: (error: string) => Promise<void>;
  onRefresh: () => Promise<void>;

  onNewClientId: (id: string) => void;

  onCreateGroup: () => void;
  onSetNodesGroup: (childIds: NodeId[], groupNode: Node) => void;
  onDetachNodesGroup: (childIds: NodeId[], groupNode: Node) => void;
  onDetachGroup: (node: Node) => Node;
  onNodesChange: OnNodesChange;
  onUpdateNodes: (id: string, data: any) => void;
  onAddNode: (nodeItem: NodeItem) => void;
  onDeleteNode: (id: NodeId) => void;
  onDuplicateNode: (id: NodeId) => void;
  onNodeInProgress: (id: NodeId, progress: number) => void;
  onPropChange: OnPropChange;
  onModifyChange: OnPropChange;
  onGetNodeFieldsData: (id: NodeId, key: string) => any;
  onCopyNode: () => void;
  onPasteNode: (
    workflow: ReactFlowJsonObject,
    position: { x: number; y: number }
  ) => void;
  expanded: string[];
  onExpand: (id?: string) => void;

  onEdgesChange: OnEdgesChange;
  onEdgesAnimate: (animated: boolean) => void;

  onUpdateFrontend: () => Promise<void>;
  onEdgesType: (type: EdgeType, send?: boolean) => Promise<void>;

  onConnect: OnConnect;

  onSubmit: () => Promise<void>;
  onTaskUpdate: (update: any) => void;

  onSaveLocalWorkFlow: (title?: string) => void;
  onLoadLocalWorkflow: (id: string) => void;
  onUpdateLocalWorkFlowGraph: (id: string) => void;
  onUpdateLocalWorkFlowTitle: (id: string, title: string) => void;
  onLoadWorkflow: (persisted: any) => void;
  onDownloadWorkflow: () => void;
} & {
  [K in AppInstanceMethodKeys]: AppInstance[K] extends (...args: infer P) => infer R
    ? (...args: P) => R | undefined
    : never;
};