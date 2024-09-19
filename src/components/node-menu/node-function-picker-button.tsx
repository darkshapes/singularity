import React, { useCallback } from 'react';
import { startCase } from "lodash-es";
import { useShallow } from "zustand/react/shallow";

import { useAppContext } from "@/store";
import { NodeItem, NodeFunction } from "@/types";
import { cn } from "@/lib/utils";

type NodeFunctionPickerButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    w: NodeFunction;
    name: string;
    setActiveItem: (nodeItem: { name: string; w: NodeFunction; } | null) => void;
};

export const NodeFunctionPickerButton = ({ w, name, setActiveItem, ...props }: NodeFunctionPickerButtonProps) => {
    const { onAddNode } = useAppContext(
        useShallow((s) => ({
          onAddNode: s.onAddNode,
        }))
    );

    const handleDrag = useCallback(
        (event: React.DragEvent<HTMLButtonElement>, i: NodeFunction) => {
          event.dataTransfer.setData("application/reactflow", JSON.stringify(w));
          event.dataTransfer.effectAllowed = "move";
        }, []
    );

    const handleMouseEnter = () => {
        setActiveItem({ w, name });
    };
    
    const handleMouseLeave = () => {
        setActiveItem(null);
    };

    return (
        <button
            className={cn(
                "cursor-click shadow-sm -mt-px w-full text-left text-accent-foreground hover:text-muted-foreground",
                "relative z-0 hover:z-50 px-1 py-0.7 rounded transition duration-75 border-x border-background hover:border-white bg-background text-xs"
            )}
            onClick={(e) => {
                e.preventDefault();
                onAddNode({ function: w, name });
            }}
            draggable
            onDragStart={(event) => handleDrag(event, w)}
            onMouseEnter={() => handleMouseEnter()}
            onMouseLeave={handleMouseLeave}
            {...props}
        >
            {startCase(name)}
        </button>
    );
};