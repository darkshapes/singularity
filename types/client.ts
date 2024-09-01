import { NodeId, PropertyKey } from "@/types";

export interface PromptResponse {
  error?: string;
}

export type History = Record<string, HistoryItem>;

export interface HistoryItem {
  outputs: Record<NodeId, Record<PropertyKey, any>>;
}
