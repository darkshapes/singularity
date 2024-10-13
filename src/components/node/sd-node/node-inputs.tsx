import React from "react";
import { Position } from "@xyflow/react";
import { NodeFunctionInputNecessity, NodeSwap } from "@/types";
import { NodeHandle } from "./node-handle";

interface NodeInputsProps {
  data: NodeFunctionInputNecessity;
  selected: boolean;
  swap: NodeSwap;
}

const NodeInputsComponent = ({ data, selected, swap }: NodeInputsProps) => {
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
        clickable={input.swapped ?? false}
        onClick={() => input.swapped ? swap(name) : {}}
      />
    ))
  );
};

export const  NodeInputs = React.memo(NodeInputsComponent);
