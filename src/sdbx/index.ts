import config from "@/config";

import initMocks from "@/mock";

export const readyServer = async () => {
  if (process.env.NODE_ENV === "development") {
    await initMocks(); // Enable mocking
    console.table({ host: config.host, isMock: true });
  }
}

export * from "./flows";
export * from "./functions";
export * from "./prompt";