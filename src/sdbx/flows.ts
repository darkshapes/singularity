import type { ReactFlowJsonObject } from "@xyflow/react";

import config from "@/config";

export const getFlowTree = async (): Promise<any> =>
    (await fetch(config.getBackendUrl("/flows"))).json();

export const getFlow = async (item: string): Promise<ReactFlowJsonObject> =>
    (await fetch(config.getBackendUrl(`/flows/${item}`))).json();