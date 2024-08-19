import { SDNodeModify } from "@/types/node";
import { PropertyKey } from "./base";
import { InputData } from "./input";
import { OutputData } from "./output";

export type WidgetInputNecessity = Record<PropertyKey, InputData>

export type WidgetInputs = {
  required: WidgetInputNecessity,
  optional: WidgetInputNecessity,
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
