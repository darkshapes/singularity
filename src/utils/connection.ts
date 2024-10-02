import { AppState } from "@/app/store";
import { Connection } from "@xyflow/react";
import { addEdge } from "@xyflow/react";

/**
 * @title Add Connection
 * @param state - Application state
 * @param connection - Flow connection
 * @returns Updated application state
 */
export const addConnection = (
  state: AppState,
  connection: Connection
): AppState => {
  const { edges } = state;
  const { targetHandle, target } = connection;

  const oneConnectionPerInput: (item: Connection) => boolean = (item) => 
    !(item.targetHandle === connection.targetHandle && item.target === connection.target);

  return {
    ...state,
    edges: addEdge(
      connection,
      edges.filter(oneConnectionPerInput)
    ),
  };
};

/**
 * @title Get Valid Connections
 * @param state - Application state
 * @returns Array of valid connections
 */
export const getValidConnections = (state: AppState): Connection[] =>
  state.edges.flatMap(({ source, sourceHandle, target, targetHandle }) =>
    sourceHandle?.length && targetHandle?.length
      ? [{ source, sourceHandle, target, targetHandle }]
      : []
  );
