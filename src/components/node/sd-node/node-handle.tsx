import React, { useCallback } from "react";
import { Connection, Handle, HandleType, Node, Position } from "@xyflow/react";
import { isArray, startCase } from "lodash-es";
import { useShallow } from "zustand/react/shallow";

import { useAppStore } from "@/store";
import { AppNode } from "@/types";
import { Slot } from "../style";
import { cn } from "@/lib/utils";

interface NodeHandleProps {
  label: string;
  type: HandleType;
  position: Position;
  slotType?: string;
  required?: boolean;
  selected?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}

export const NodeHandle = ({
  label,
  type,
  position,
  slotType,
  required,
  selected = false,
  clickable = false,
  onClick,
}: NodeHandleProps) => {
  const nodes = useAppStore(useShallow((s) => s.nodes));

  const handleValidCheck = useCallback(
    (connection: Connection) => {
      if (connection.targetHandle === "Any" || connection.sourceHandle === "Any")
        return true;

      // try {
      const getNode = (id: string | null) => nodes.find((n) => n.id === id) as AppNode;

      const targetNode = getNode(connection.target);
      const sourceNode = getNode(connection.source);

      const targetInput = {...targetNode.data.fn.inputs.required, ...targetNode.data.fn.inputs.optional};

      const targetType = targetInput[String(connection.targetHandle)].type;
      const sourceType = sourceNode.data.fn.outputs[String(connection.sourceHandle)].type;
      
      return targetType === sourceType;
    },
    [nodes]
  );

  const positionStyles = {
    left: position === Position.Left ? "-6.5px" : "auto",
    right: position === Position.Right ? "-6.5px" : "auto",
    transform: "translate(0, -30%)",
  };

  return (
    <Slot 
      position={position} 
      required={required ? 1 : 0} 
      className={cn("group", clickable && "cursor-pointer")} 
      onClick={onClick}
    >
      {required ? (
        <Handle
          id={label}
          type={type}
          position={position}
          isValidConnection={handleValidCheck}
          style={{
            width: "12px",
            height: "12px",
            boxShadow: "0px 0px 12px rgba(72, 66, 66, 0.4)",
            borderColor: selected ? "white" : "#a3a3a3",
            transitionDuration: "200ms",
            ...positionStyles,
          }}
        />
      ) : null}
      <a
        className={cn(
          "mb-1 text-sm text-muted-foreground",
          clickable && "group-hover:underline group-hover:text-white transition duration-200 ease-in-out",
        )}
        title={slotType}
      >
        {label}
      </a>
    </Slot>
  );
};
