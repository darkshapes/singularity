import config from "@/config";

export const getNodeLibrary = async (): Promise<any> =>
    await (await fetch(config.getBackendUrl("/nodes"))).json();