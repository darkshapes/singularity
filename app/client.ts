import config from "@/app/config";

import type { Connection, Graph, PersistedGraph, Widget } from "@/types";
import { PromptResponse } from "@/types/client";
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
): Promise<PromptResponse> => {
  console.log(prompt)
  console.log(JSON.stringify(prompt))
  const response = await fetch(getBackendUrl("/prompt"), {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(prompt),
  });
  const error = response.status !== 200 ? await response.text() : undefined;
  return { error };
};

const reconnection = (oldConnections: Connection[]): Connection[] => {
  let connections: Connection[] = oldConnections.map((connect) => {
    if (connect.sourceHandle === "*") {
      const parent: any = oldConnections.find(
        (c) => c.target === connect.source
      );
      return {
        ...connect,
        source: parent.source,
        sourceHandle: parent.sourceHandle,
      };
    }
    return connect;
  });

  if (connections.find((c) => c.sourceHandle === "*")) {
    return reconnection(connections);
  } else {
    return connections.filter((c) => c.targetHandle !== "*");
  }
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

      console.log(widget_inputs);
      console.log(node);
      
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

  // Reconnection
  console.log(graph.connections)
  // let connections = reconnection(graph.connections);

  // connections.forEach((edge) => {
  //   const source = graph.data[edge.source];
  //   if (!source) return;
  //   // const outputs = widgets[source.value.widget].outputs
  //   // const outputName = Object.keys(outputs).find(
  //   //   key => outputs[key] === edge.sourceHandle
  //   // );
  //   if (prompt[edge.target]) {
  //     prompt[edge.target].inputs[edge.targetHandle] = [
  //       edge.source,
  //     ];
  //   }
  // });

  // return {
  //   prompt,
  //   client_id: clientId,
  //   extra_data: { extra_pnginfo: { workflow: { connections, data } } },
  // };

  return multigraph;
};
