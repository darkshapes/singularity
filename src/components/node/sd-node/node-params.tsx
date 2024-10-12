import React from "react";
import { NodeFunctionInputNecessity, NodeUpdate } from "@/types";
import { NodeHandle } from "@/components/node/sd-node/node-handle";
import { Position } from "@xyflow/react";
import { InputParams } from "./input-param";

interface NodeParamsProps {
  data: NodeFunctionInputNecessity;
  selected: boolean;
  update: NodeUpdate;
}

const NodeSwappedParamsComponent = ({ data, selected, update }: NodeParamsProps) => {
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
          // onClick={() => swapItem({ name, input })}
        />
      ))
  )
};

const NodeSwappedParams = React.memo(NodeSwappedParamsComponent);

const NodeParamsComponent = ({ data, selected, update }: NodeParamsProps) => {
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
              // onClick={() => swapItem({ name, input })}
            />
          )}
          <InputParams name={name} input={input} update={update} />
        </div>
      ))}
    </div>
  );
};

const NodeParams = React.memo(NodeParamsComponent);

export { NodeParams, NodeSwappedParams };