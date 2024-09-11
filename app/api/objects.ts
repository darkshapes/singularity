import config from "@/app/config";

export const getObjectLibrary = async (): Promise<any> =>
    await (await fetch(config.getBackendUrl("/nodes"))).json();