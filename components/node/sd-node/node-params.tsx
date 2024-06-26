import NodeHandle from "@/components/node/sd-node/node-handle";
import { Flow } from "@/types";
import React from "react";
import { Position } from "reactflow";
import InputParams from "./input-param";

interface NodeParamsProps {
  nodeId: string;
  data: {
    name: string;
    type: string;
    input: [Flow];
  }[];
  selected: boolean;
}

const NodeParams = ({ data, nodeId, selected }: NodeParamsProps) => {
  if (!data?.length) return null;
  return (
    <div className="space-y-2">
      {data.map(({ name, type, input }, i) => (
        <div
          key={i}
          className={`text-muted-foreground focus:text-accent-foreground grid ${
            name === "text" ? "grid-cols-1" : "grid-cols-2"
          } items-center gap-2`}
        >
          {name !== "text" && (
            <NodeHandle
              slotType={type}
              label={name}
              type="target"
              position={Position.Left}
              isRequired={false}
              selected={selected}
            />
          )}
          <InputParams name={name} id={nodeId} input={input} />
        </div>
      ))}
    </div>
  );
};

export default React.memo(NodeParams);
