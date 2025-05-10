import config from "@/config";

import type { Graph, TaskUpdate } from "@/types";

export const sendPrompt = async (
  prompt: Graph
): Promise<TaskUpdate> => {
  // console.log(prompt)
  // console.log(JSON.stringify(prompt))
  const response = await fetch(config.getBackendUrl("/prompt"), {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(prompt),
  });
  // TODO: error handling here
  // return response.status !== 200 ? await response.text() : undefined;
  return await response.json();
};

export const subscribeToTask = (taskId: string, callback: (data: TaskUpdate) => void): WebSocket => {
  const ws = new WebSocket(`ws://${config.host}/ws/task/${taskId}`);

  console.log("subscribed to task")
  console.log(taskId);

  ws.onmessage = (event: MessageEvent) => {
      const data: TaskUpdate = JSON.parse(event.data);
      callback(data);  // Invoke the callback with the received data
  };

  ws.onclose = () => {
      console.log("WebSocket connection closed");
  };

  ws.onerror = (error) => {
      console.error("WebSocket error:", error);
  };

  return ws;  // Return the WebSocket instance if needed for further control
};