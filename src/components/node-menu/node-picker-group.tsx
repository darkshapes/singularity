import React from "react";

import { NodeFunction } from "@/types";
import { NodePickerGroupItems } from "./node-picker";
import { NodeFunctionPickerButton } from "./node-function-picker-button";
import {
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from "@/components/ui/context-menu";

interface NodePickerGroupProps {
  category: string;
  items: NodePickerGroupItems;
  setActiveItem: (nodeItem: {name: string; fn: NodeFunction; } | null) => void;
  expandedItems: string[];
  setExpandedItems: (items: string[]) => void;
}

const NodePickerGroupComponent = ({
  category,
  items,
  setActiveItem,
  expandedItems,
  setExpandedItems,
}: NodePickerGroupProps) => {
  return (
    // a nested menu inside the main context menu
    <ContextMenuSub>
      <ContextMenuSubTrigger className="text-xs text-center py-0 my-0 px-1 w-full">
        {category}
      </ContextMenuSubTrigger>
      <ContextMenuSubContent className="p-2">
        <div className="flex flex-col items-baseline justify-start">
          {Object.entries(items.subcategories).map(([subCat, subItems]) => (
            <NodePickerGroup
              key={subCat}
              category={subCat}
              items={subItems}
              setActiveItem={setActiveItem}
              expandedItems={expandedItems}
              setExpandedItems={setExpandedItems}
            />
          ))}
          {Object.values(items.subcategories).length > 0 && Object.values(items.functions).length > 0 && <ContextMenuSeparator />}
          {Object.entries(items.functions).map(([name, e]) => (
            <NodeFunctionPickerButton 
              key={name}
              name={name}
              fn={e}
              setActiveItem={setActiveItem}
            />
          ))}
        </div>
      </ContextMenuSubContent>
    </ContextMenuSub>
  );
};

export const NodePickerGroup = React.memo(NodePickerGroupComponent);