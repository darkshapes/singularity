import React from "react";
import { Position } from "@xyflow/react";
import { WidgetOutputs } from "@/types";
import { NodeHandle } from "./node-handle";

interface NodeOutputsProps {
  data: WidgetOutputs;
  selected: boolean;
}

const NodeOutputsComponent = ({ data, selected }: NodeOutputsProps) => {
  if (!Object.keys(data).length) return <div />;
  return (
    <div className="flex-1">
      {Object.entries(data).map(([ name, { type } ], i) => (
        <NodeHandle
          key={i}
          slotType={type}
          label={name}
          type="source"
          position={Position.Right}
          required
          selected={selected}
        />
      ))}
    </div>
  );
};

export const NodeOutputs = React.memo(NodeOutputsComponent);
