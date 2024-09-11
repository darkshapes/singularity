import config from "@/app/config";

import type { PersistedGraph } from "@/types";

export const getFlowTree = async (): Promise<any> =>
    (await fetch(config.getBackendUrl("/flows"))).json();

export const getFlow = async (item: string): Promise<PersistedGraph> =>
    (await fetch(config.getBackendUrl(`/flows/${item}`))).json();