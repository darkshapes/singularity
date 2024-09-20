import React from "react";
import { Position } from "@xyflow/react";
import { WidgetInputNecessity } from "@/types";
import { NodeHandle } from "./node-handle";

interface NodeInputsProps {
  data: WidgetInputNecessity;
  selected: boolean;
}

const NodeInputsComponent = ({ data, selected }: NodeInputsProps) => {
  return (
    Object.entries(data).map(([ name, { type } ], i) => (
      <NodeHandle
        key={i}
        slotType={type}
        label={name}
        type="target"
        position={Position.Left}
        required
        selected={selected}
      />
    ))
  );
};

export const  NodeInputs = React.memo(NodeInputsComponent);
