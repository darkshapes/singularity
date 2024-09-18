import { PropertyKey } from "./base";
import { InputData } from "./input";
import { OutputData } from "./output";

export type NodeFunctionInputNecessity = Record<PropertyKey, InputData>;

export type NodeFunctionInputs = {
  required: NodeFunctionInputNecessity;
  optional: NodeFunctionInputNecessity;
}

export type NodeFunctionOutputs = Record<PropertyKey, OutputData>;

/**
 * Node function
 * @property path - Node function path
 * @property fname - Function name on serverside
 * @property inputs - Input information
 * @property outputs - Output information
 * @property display - Results display on node
 */
export interface NodeFunction {
  path: string;
  fname: string;
  steps?: number;
  inputs: NodeFunctionInputs;
  outputs: NodeFunctionOutputs;
  display: boolean;
}
