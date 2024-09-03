import { NodeId, PropertyKey } from "@/types";

export type History = Record<string, HistoryItem>;

export interface HistoryItem {
  outputs: Record<NodeId, Record<PropertyKey, any>>;
}
