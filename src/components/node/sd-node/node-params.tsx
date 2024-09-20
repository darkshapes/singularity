import React from "react";
import { WidgetInputNecessity } from "@/types";
import { NodeHandle } from "@/components/node/sd-node/node-handle";
import { Position } from "@xyflow/react";
import { InputParams } from "./input-param";

interface NodeParamsProps {
  nodeId: string;
  data: WidgetInputNecessity;
  selected: boolean;
  swapItem: (item: any) => void;
}

const NodeSwappedParamsComponent = ({ data, selected, swapItem }: Omit<NodeParamsProps, 'nodeId'>) => {
  return (
      Object.entries(data).map(([ name, input ], i) => (
        <NodeHandle
          key={i}
          slotType={input.type}
          label={name}
          type="target"
          position={Position.Left}
          required
          selected={selected}
          clickable={true}
          onClick={() => swapItem({ name, input })}
        />
      ))
  )
};

const NodeSwappedParams = React.memo(NodeSwappedParamsComponent);

const NodeParamsComponent = ({ data, nodeId, selected, swapItem }: NodeParamsProps) => {
  return (
    <div className="space-y-2">
      {Object.entries(data).map(([ name, input ], i) => (
        <div
          key={i}
          className={`text-muted-foreground focus:text-accent-foreground grid ${
            name === "text" ? "grid-cols-1" : "grid-cols-2"
          } items-center gap-2`}
        >
          {name !== "text" && (
            <NodeHandle
              key={i}
              slotType={input.type}
              label={name}
              type="target"
              position={Position.Left}
              required={false}
              selected={selected}
              clickable={true}
              onClick={() => swapItem({ name, input })}
            />
          )}
          <InputParams name={name} id={nodeId} input={input} />
        </div>
      ))}
    </div>
  );
};

const NodeParams = React.memo(NodeParamsComponent);

export { NodeParams, NodeSwappedParams };