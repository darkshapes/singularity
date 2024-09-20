import { Node, XYPosition } from "@xyflow/react";
import { NodeId, PropertyKey, NodeFunctionKey } from "@/types";
import { NodeFunction } from "@/types/function";

/**
 * Instantiated node modification properties
 * @property color - Color
 * @property nickname - Nickname
 */
export type NodeModifyData = {
  color?: string;
  nickname?: string;
}

/**
 * Instantiated node data
 * @property fields - Property fields
 * @property modify - Modify properties
 */
export type InstantiatedNodeData = {
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
export type NodeData = {
  name: string;
  fn: NodeFunction;
  position?: XYPosition;
  key?: string;
  width?: number;
  height?: number;
} & InstantiatedNodeData;

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