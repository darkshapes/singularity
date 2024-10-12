import { Node, XYPosition } from "@xyflow/react";
import { NodeId, PropertyKey, NodeFunctionKey } from "@/types";
import { NodeFunction } from "@/types/function";

export type NodeModify = (m: NodeModifiableData) => void;
export type NodeUpdate = (field: string, v: any) => void;

/**
 * Instantiated node modification properties
 * @property color - Color
 * @property nickname - Nickname
 */
export type NodeModifiableData = {
  expanded?: boolean;
  color?: string;
  nickname?: string;
}

/**
 * Node object
 * @property fn - Node function object
 * @property fields - Property fields
 * @property modify - Modify properties
 */
export type NodeData = {
  fn: NodeFunction;
  fields?: Record<PropertyKey, any>;
  modifiable?: NodeModifiableData;
  modify: NodeModify;
  update: NodeUpdate;
}

/**
 * Node construction
 * @property name - Name
 * @property fn - Node function object
 * @property node - Instantiated node object
 * @property position - Node position
 * @property key - Node key
 * @property width - Node width
 * @property height - Node height
 */
export type NodeConstructor = {
  id?: string;
  name: string;
  fn: NodeFunction;
  position?: XYPosition;
  width?: number;
  height?: number;
}

/**
 * Node execution progress object
 * @property id - Node ID
 * @property progress - Progress value
 */
export type NodeInProgress = {
  id: NodeId;
  progress: number;
}

export type AppNode = Node<NodeData>;