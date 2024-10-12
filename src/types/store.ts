import { createStore } from 'zustand';
import { Edge, ReactFlowInstance, ReactFlowJsonObject, OnConnect, OnEdgesChange, OnNodesChange } from "@xyflow/react";
import type {
  AppEdge,
  AppNode,
  EdgeType,
  Graph,
  NodeConstructor,
  NodeFunction,
  NodeFunctionKey,
  NodeId,
  NodeInProgress,
  NodeModifyData,
  PropertyKey,
} from "@/types";

export type AppInstance = ReactFlowInstance<AppNode>;

type MethodKeys<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

export type AppInstanceMethodKeys = MethodKeys<AppInstance>;

export type AppState = {
  instance?: AppInstance;
  setInstance: (instance: AppInstance) => void;

  library: Record<NodeFunctionKey, NodeFunction>;
  results: Record<NodeId, any>;

  nodes: AppNode[];
  edges: AppEdge[];

  theme: "dark" | "light";
  toggleTheme: () => void; 

  edgeType: EdgeType;
  nodeInProgress?: NodeInProgress;
  promptError?: string;
  clientId?: string;
  
  initialize: (instance: AppInstance) => Promise<void>;
  hydrate: () => void;

  constructNode: (item: NodeConstructor) => AppNode;

  toNetworkX: () => Graph;

  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;

  onError: (error: string) => Promise<void>;
  onRefresh: () => Promise<void>;

  onNewClientId: (id: string) => void;

  onEdgesAnimate: (animated: boolean) => void;

  onUpdateFrontend: () => Promise<void>;
  onEdgesType: (type: EdgeType, send?: boolean) => Promise<void>;

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