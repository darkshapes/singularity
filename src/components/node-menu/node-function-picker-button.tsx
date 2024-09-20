import React, { useCallback } from 'react';
import { startCase } from "lodash-es";
import { useShallow } from "zustand/react/shallow";

import { useAppStore } from "@/store";
import { NodeItem, NodeFunction } from "@/types";
import { cn } from "@/lib/utils";

type NodeFunctionPickerButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    fn: NodeFunction;
    name: string;
    setActiveItem: (nodeItem: { name: string; fn: NodeFunction; } | null) => void;
};

export const NodeFunctionPickerButton = ({ fn, name, setActiveItem, ...props }: NodeFunctionPickerButtonProps) => {
    const { addNodes, constructNode } = useAppStore((s) => ({ addNodes: s.addNodes, constructNode: s.constructNode }));

    const handleDrag = useCallback(
        (event: React.DragEvent<HTMLButtonElement>, i: NodeFunction) => {
          event.dataTransfer.setData("application/reactflow", JSON.stringify(fn));
          event.dataTransfer.effectAllowed = "move";
        }, []
    );

    const handleMouseEnter = () => {
        setActiveItem({ fn, name });
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
                addNodes(constructNode({ fn, name }));
            }}
            draggable
            onDragStart={(event) => handleDrag(event, fn)}
            onMouseEnter={() => handleMouseEnter()}
            onMouseLeave={handleMouseLeave}
            {...props}
        >
            {startCase(name)}
        </button>
    );
};