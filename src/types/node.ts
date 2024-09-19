import { XYPosition } from "reactflow";
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
 * @property widget - Widget key
 * @property fields - Property fields
 * @property modify - Modify properties
 */
export interface NodeData {
  function: NodeFunctionKey;
  fields: Record<PropertyKey, any>;
  modify?: NodeModifyData;
}

/**
 * Node object
 * @property widget - Widget object
 * @property name - Name
 * @property node - Instantiated node object
 * @property position - Node position
 * @property key - Node key
 * @property width - Node width
 * @property height - Node height
 * @property parentNode - Parent node ID
 */
export interface NodeItem {
  function: NodeFunction;
  name: string;
  node?: NodeData;
  position?: XYPosition;
  key?: string;
  width?: number;
  height?: number;
  parentNode?: string;
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