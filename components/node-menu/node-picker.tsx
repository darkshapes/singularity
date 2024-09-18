"use client";

import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useShallow } from "zustand/react/shallow";
import Fuse from "fuse.js";

import { useAppStore } from "@/app/store";
import type { Widget } from "@/types";
import { NodePickerGroup } from "./node-picker-group";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { NodePickerWidgetButton } from "./node-picker-widget-button";
import { ContextMenuSeparator } from "@/components/ui/context-menu";

const NodePickerComponent = ({ setActiveItem, setShowPath }: any) => {
  const { widgets, onAddNode } = useAppStore(
    useShallow((state) => ({
      widgets: state.widgets,
      onAddNode: state.onAddNode,
    }))
  );

  const [category, setCategory] = useState<any>({});
  const [keywords, setKeywords] = useState<string>("");
  const [widgetList, setWidgetList] = useState<Record<string, Widget>>({});
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  useEffect(() => {
    const byCategory: any = {};

    setShowPath(keywords !== ""); // show path in node preview when searching

    const addWidgetToCategory = (categoryPath: string[], name: string, widget: Widget) => {
      let currentLevel = byCategory;

      categoryPath.forEach((category, index) => {
        if (!currentLevel[category]) {
          currentLevel[category] = { widgets: {}, subcategories: {} };
        }
        if (index === categoryPath.length - 1) {
          currentLevel[category].widgets[name] = widget
        }
        currentLevel = currentLevel[category].subcategories;
      });
    };

    let matchedWidgets: Record<string, Widget>;

    if (keywords) {
      const fuse = new Fuse(Object.entries(widgets), {
        keys: ["0"], // Search by widget name (keys are the names of widgets)
        threshold: 0.4, // Adjust to fine-tune fuzzy search sensitivity
      });

      matchedWidgets = fuse
        .search(keywords)
        .reduce((acc: Record<string, Widget>, result) => {
          const [name, widget] = result.item;
          acc[name] = widget;
          return acc;
        }, {});
    } else {
      matchedWidgets = { ...widgets };
    }

    for (const [name, widget] of Object.entries(matchedWidgets)) {
      const categoryPath = widget.path.split("/");
      addWidgetToCategory(categoryPath, name, widget);
    }

    setWidgetList(matchedWidgets);
    setCategory(byCategory);
  }, [widgets, keywords]);

  const handleKeywordsChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setKeywords(event.target.value);
    }, []
  );

  return (
    <div className="flex flex-col">
      <div className="flex px-2">
        <div className="relative w-full">
          <input
            name="search"
            autoComplete="off"
            type="text"
            className="px-9 flex h-6 w-full rounded-md border border-input bg-transparent text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Search..."
            onChange={handleKeywordsChange}
            onKeyDown={e => e.stopPropagation()}
            autoFocus={true}
          />
          <div
            className="absolute inset-y-0 left-0 pl-2  
              flex items-center  
              pointer-events-none"
          >
            <MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      <ContextMenuSeparator />

      <div className="nodeMenu flex flex-col overflow-y-scroll" style={{ maxHeight: '14rem', scrollbarWidth: 'none' }} >
        {
          (keywords === "") ?
            Object.entries(category).map(([cat, items]: any, index) => (
              <motion.div
                key={cat}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.01,
                  duration: 0.2,
                }}
              >
                <NodePickerGroup
                  key={cat}
                  category={cat}
                  items={items}
                  setActiveItem={setActiveItem}
                  expandedItems={expandedItems}
                  setExpandedItems={setExpandedItems}
                />
              </motion.div>
            )) :
            Object.entries(widgetList).map(([name, w]: [string, Widget]) => (
              <NodePickerWidgetButton
                key={name}
                w={w}
                name={name}
                setActiveItem={setActiveItem}
              />
            ))
        }
      </div>
    </div>
  );
};

export const NodePicker = React.memo(NodePickerComponent);