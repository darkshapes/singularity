import { NodeId, PropertyKey, WidgetKey } from "@/types";

export interface PromptRequest {
  client_id?: string;
  prompt: Record<NodeId, Node>;
  extra_data?: ExtraData;
}

export interface ExtraData {
  extra_pnginfo?: Record<string, any>;
}

export interface PromptResponse {
  error?: string;
}

export interface Node {
  class_type: WidgetKey;
  inputs: Record<PropertyKey, any>;
}

export type History = Record<string, HistoryItem>;

export interface HistoryItem {
  outputs: Record<NodeId, Record<PropertyKey, any>>;
}
