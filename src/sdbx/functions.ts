import config from "@/app/config";

export const getNodeFunctions = async (): Promise<any> =>
    await (await fetch(config.getBackendUrl("/nodes"))).json();