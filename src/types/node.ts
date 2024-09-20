import { Node, XYPosition } from "@xyflow/react";
import { NodeId, PropertyKey, NodeFunctionKey } from "@/types";
import { NodeFunction } from "@/types/function";

/**
 * Node position
 */
export interface NodePosition {
  x: number;
  y: number;
}

/**
 * Instantiated node modification properties
 * @property color - Color
 * @property nickname - Nickname
 */
export interface NodeModifyData {
  color?: string;
  nickname?: string;
}

/**
 * Instantiated node data
 * @property fkey - Function key (equivalent to designated name)
 * @property fields - Property fields
 * @property modify - Modify properties
 */
export interface NodeData {
  fkey: NodeFunctionKey;
  fields: Record<PropertyKey, any>;
  modify?: NodeModifyData;
}

/**
 * Node object
 * @property name - Name
 * @property fn - Node function object
 * @property node - Instantiated node object
 * @property position - Node position
 * @property key - Node key
 * @property width - Node width
 * @property height - Node height
 */
export interface NodeItem {
  name: string;
  fn: NodeFunction;
  data?: NodeData;
  position?: XYPosition;
  key?: string;
  width?: number;
  height?: number;
}

/**
 * Node execution progress object
 * @property id - Node ID
 * @property progress - Progress value
 */
export interface NodeInProgress {
  id: NodeId;
  progress: number;
}

export type AppNode = Node<NodeData>;