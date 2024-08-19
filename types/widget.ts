import { SDNodeModify } from "@/types/node";
import { PropertyKey, WidgetKey } from "./base";
import { InputData } from "./input";
import { OutputData } from "./output";

export type WidgetInputs = {
  required: Record<PropertyKey, InputData>,
  optional: Record<PropertyKey, InputData>,
}

export type WidgetOutputs = Record<PropertyKey, OutputData>;

/**
 * Widget object
 * @property path - Widget path
 * @property fname - Widget function name on serverside
 * @property inputs - Input information
 * @property outputs - Output information
 */
export interface Widget extends SDNodeModify {
  path: string,
  fname: string,
  inputs: WidgetInputs;
  outputs: WidgetOutputs;
}
