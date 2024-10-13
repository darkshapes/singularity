import { Node, XYPosition } from "@xyflow/react";
import { FieldData, NodeId, PropertyKey } from "@/types";
import { NodeFunction } from "@/types/function";

export type NodeModify = (m: NodeModifiableData) => void;
export type NodeSwap = (p: string) => void;
export type NodeUpdate = (v: any) => void;

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

export type NodeFields = Record<PropertyKey, FieldData>;
export type NodeOrderedFields = [PropertyKey, FieldData][];

/**
 * Node object
 * @property fn - Node function object
 * @property order - Optional input (parameter) order
 * @property stored - Stored parameter values (for swapping)
 * @property fields - Property fields
 * @property modifiable - Modifiable properties
 * @method modify - Modify properties
 * @method swap - Swap a parameter
 * @method update - Update a field
 */
export type NodeData = {
  fn: NodeFunction;
  order?: PropertyKey[];
  stored?: any[];
  fields?: NodeFields;
  modifiable?: NodeModifiableData;
  modify: NodeModify;
  swap: NodeSwap;
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