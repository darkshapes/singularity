import React from "react";
import { NodeOrderedFields, NodeSwap, NodeUpdate } from "@/types";
import { NodeHandle } from "@/components/node/sd-node/node-handle";
import { Position } from "@xyflow/react";
import { InputParams } from "./input-param";

interface NodeParamsProps {
  data: NodeOrderedFields;
  selected: boolean;
  swap: NodeSwap;
  update: NodeUpdate;
}

const NodeParamsComponent = ({ data, selected, swap, update }: NodeParamsProps) => {  
  return (
    <div className="space-y-2">
      {data.map(([ name, input ], i) => (
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
              onClick={() => swap(name)}
            />
          )}
          <InputParams name={name} input={input} update={update} />
        </div>
      ))}
    </div>
  );
};

export const NodeParams = React.memo(NodeParamsComponent);