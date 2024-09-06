import type {
  EdgeType,
  GalleryItem,
  ImageItem,
  NodeId,
  NodeInProgress,
  NodeItem,
  PersistedGraph,
  PropertyKey,
  SDNode,
  Widget,
  WidgetKey,
} from "@/types";
import { Edge, Node, OnConnect, OnEdgesChange, OnNodesChange } from "reactflow";

export type OnPropChange = (
  id: NodeId,
  property: PropertyKey,
  value: any
) => void;

export interface AppState {
  page?: string;
  counter: number;
  widgets: Record<WidgetKey, Widget>;
  customWidgets: string[];
  graph: Record<NodeId, SDNode>;
  results: Record<NodeId, any>;
  nodes: Node[];
  edges: Edge[];
  gallery: GalleryItem[];
  edgeType: EdgeType;
  nodeInProgress?: NodeInProgress;
  promptError?: string;
  clientId?: string;

  
  onSetPage: (value: string) => void;
  onNewClientId: (id: string) => void;
  onError: (error: string) => Promise<void>;
  onRefresh: () => Promise<void>;
  onInit: () => Promise<void>;

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
  onCopyNode: () => PersistedGraph;
  onPasteNode: (
    workflow: PersistedGraph,
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

  onPersistTemp: () => void;
  onSaveLocalWorkFlow: (title?: string) => void;
  onLoadLocalWorkflow: (id: string) => void;
  onUpdateLocalWorkFlowGraph: (id: string) => void;
  onUpdateLocalWorkFlowTitle: (id: string, title: string) => void;
  onLoadWorkflow: (persisted: any) => void;
  onDownloadWorkflow: () => void;
}
