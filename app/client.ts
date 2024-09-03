import config from "@/app/config";

import type { Connection, Graph, PersistedGraph, Widget } from "@/types";
import { getBackendUrl } from "@/utils";

import initMocks from "@/mock";

export const readyServer = async () => {
  if (process.env.NODE_ENV === "development") {
    await initMocks(); // Enable mocking
    console.table({ host: config.host, isMock: true });
  }
}

export const getWidgetLibrary = async (): Promise<any> =>
  (await fetch(getBackendUrl("/nodes"))).json();

export const sendPrompt = async (
  prompt: Graph
): Promise<string | undefined> => {
  // console.log(prompt)
  // console.log(JSON.stringify(prompt))
  const response = await fetch(getBackendUrl("/prompt"), {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(prompt),
  });
  // TODO: error handling here
  // return response.status !== 200 ? await response.text() : undefined;
  return await response.text();
};

export const createPrompt = ({
  graph,
  widgets,
  customWidgets,
  clientId,
}: {
  graph: PersistedGraph;
  widgets: Record<string, Widget>;
  customWidgets: string[];
  clientId?: string;
}): Graph => {
  const multigraph: Graph = {
    directed: true,
    multigraph: true,
    graph: {},
    nodes: Object.entries(graph.data).map(([id, node]) => {
      // if (customWidgets.includes(node.value.widget)) return; // pass through graph and reroute
  
      const widget = widgets[node.value.widget];
      const fname = widget.fname;
  
      const outputs = Object.keys(widget.outputs);

      const inputs = Object.values(widget.inputs.required).map(n => n.fname);
      const widget_inputs = Object.keys(widget.inputs.optional).reduce((a, v) => (
        { 
          ...a, 
          [widget.inputs.optional[v].fname]: node.value.fields[v]
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
    links: Object.entries(graph.connections).map(([key, edge]) => {
      const source = edge.source;
      const target = edge.target;

      // console.log(source);
      // console.log(target);

      const sourceNode = widgets[graph.data[source].value.widget];
      const targetNode = widgets[graph.data[target].value.widget];

      // console.log(sourceNode);
      // console.log(targetNode);

      const sourceHandle = Object.keys(sourceNode.outputs).findIndex(n => n === edge.sourceHandle);
      const targetHandle = targetNode.inputs.required[edge.targetHandle].fname;

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

export const subscribeToTask = (taskId: string, callback: (data: any) => void): WebSocket => {
  const ws = new WebSocket(`ws://${config.host}/ws/${taskId}`);

  console.log("subscribed to task")
  console.log(taskId);

  ws.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      console.log(data);
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