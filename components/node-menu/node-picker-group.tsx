"use client";

import React from "react";

import { Widget } from "@/types";
import { NodePickerWidgetButton } from "./node-picker-widget-button";
import {
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from "@/components/ui/context-menu";
import { cn } from "@/lib/utils";

interface NodePickerGroupItems {
  widgets: Record<string, Widget>;
  subcategories: NodePickerGroupItems[];
}

interface NodePickerGroupProps {
  category: string;
  items: NodePickerGroupItems;
  setActiveItem: (nodeItem: {name: string; w: Widget} | null) => void;
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
          {Object.values(items.subcategories).length > 0 && Object.values(items.widgets).length > 0 && <ContextMenuSeparator />}
          {Object.entries(items.widgets).map(([name, e]) => (
            <NodePickerWidgetButton 
              key={name}
              name={name}
              w={e}
              setActiveItem={setActiveItem}
            />
          ))}
        </div>
      </ContextMenuSubContent>
    </ContextMenuSub>
  );
};

export const NodePickerGroup = React.memo(NodePickerGroupComponent);