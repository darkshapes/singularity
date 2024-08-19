import React from "react";
import { Position } from "reactflow";
import { WidgetInputs } from "@/types";
import { NodeHandle } from "./node-handle";

interface NodeInputsProps {
  data: WidgetInputs;
  selected: boolean;
}

const NodeInputsComponent = ({ data, selected }: NodeInputsProps) => {
  return (
    <>
      {Object.entries(data.required).map(([ name, { type } ], i) => (
        <NodeHandle
          key={i}
          slotType={type}
          label={name}
          type="target"
          position={Position.Left}
          required
          selected={selected}
        />
      ))}
      {Object.entries(data.optional).map(([ name, { type } ], i) => (
        <NodeHandle
          key={i}
          slotType={type}
          label={name}
          type="target"
          position={Position.Left}
          required
          selected={selected}
        />
      ))}
    </>
  );
};

export const NodeInputs = React.memo(NodeInputsComponent);
