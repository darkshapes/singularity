import type { ReactFlowJsonObject } from "reactflow";

import config from "@/app/config";

export const getFlowTree = async (): Promise<any> =>
    (await fetch(config.getBackendUrl("/flows"))).json();

export const getFlow = async (item: string): Promise<ReactFlowJsonObject> =>
    (await fetch(config.getBackendUrl(`/flows/${item}`))).json();