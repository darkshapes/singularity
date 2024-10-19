import React from 'react';

import { cn } from "@/lib/utils";

type NodeFunctionPickerButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    title: string;
    toggleActiveItem: (b: boolean) => void;
};

export const NodeFunctionPickerButton = ({ title, toggleActiveItem, ...props }: NodeFunctionPickerButtonProps) => {
    return (
        <button
            className={cn(
                "cursor-click shadow-sm -mt-px w-full text-left text-accent-foreground hover:text-muted-foreground",
                "relative z-0 hover:z-50 px-1 py-0.7 rounded transition duration-75 border-x border-background hover:border-white bg-background text-xs"
            )}
            draggable
            onClick={props.onClick}
            onDragStart={props.onDragStart}
            onMouseEnter={() => toggleActiveItem(true)}
            onMouseLeave={() => toggleActiveItem(false)}
            {...props}
        >
            {title}
        </button>
    );
};