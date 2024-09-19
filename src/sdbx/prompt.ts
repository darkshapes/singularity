import config from "@/config";

import type { AppState, Graph } from "@/types";

type PromptResult =
  | { error: string; task_id?: never }
  | { task_id: string; error?: never };

export const sendPrompt = async (
  prompt: Graph
): Promise<PromptResult> => {
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

export const createPrompt = ({
  state,
}: {
  state: AppState;
}): Graph => {
  const multigraph: Graph = {
    directed: true,
    multigraph: true,
    graph: {},
    nodes: state.getNodes().map((node) => {
      const id = node.id;

      const fn = state.functions[node.data.function];
      const fname = fn.fname;
  
      const outputs = Object.keys(fn.outputs);

      const inputs = Object.values(fn.inputs.required).map(n => n.fname);
      const widget_inputs = Object.keys(fn.inputs.optional).reduce((a, v) => (
        { 
          ...a, 
          [fn.inputs.optional[v].fname]: node.data.fields[v]
        }
      ), {}) 

      // console.log(widget_inputs);
      // console.log(node);
      
      return {
        id,
        fname,
        outputs,
        inputs,
        widget_inputs,
      }
    }),
    links: state.getEdges().map((edge, index: number) => {
      const key = index.toString();

      const source = edge.source;
      const target = edge.target;

      // console.log(source);
      // console.log(target);

      const sourceNode = state.functions[state.getNode(source)?.data.function!];
      const targetNode = state.functions[state.getNode(target)?.data.function!];

      // console.log(sourceNode);
      // console.log(targetNode);

      const sourceHandle = Object.keys(sourceNode.outputs).findIndex(n => n === edge.sourceHandle);
      const targetHandle = targetNode.inputs.required[edge.targetHandle!].fname;

      return {
        source,
        target,
        source_handle: sourceHandle,
        target_handle: targetHandle,
        key,
      }
    })
  };

  return multigraph;
};

type TaskSubscriptionResult = { task_id: string; }
  | { results: string; completed?: true; error?: never }
  | { error: string; results?: never; completed?: never };

export const subscribeToTask = (taskId: string, callback: (data: any) => void): WebSocket => {
  const ws = new WebSocket(`ws://${config.host}/ws/${taskId}`);

  console.log("subscribed to task")
  console.log(taskId);

  ws.onmessage = (event: MessageEvent) => {
      const data: TaskSubscriptionResult = JSON.parse(event.data);
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