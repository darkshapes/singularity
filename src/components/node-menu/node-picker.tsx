import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Fuse from "fuse.js";

import { useAppStore } from "@/store";
import { NodeFunction } from "@/types";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { ContextMenuSeparator } from "@/components/ui/context-menu";

import { NodePickerGroup } from "./node-picker-group";
import { NodeFunctionPickerButton } from "./node-function-picker-button";

export interface NodePickerGroupItems {
  functions: Record<string, NodeFunction>;
  subcategories: NodePickerGroupCategory;
};

export type NodePickerGroupCategory = Record<string, NodePickerGroupItems>;

const NodePickerComponent = ({ setActiveItem, setShowPath }: any) => {
  const { functions } = useAppStore((s) => ({ functions: s.functions }));

  const [category, setCategory] = useState<any>({});
  const [keywords, setKeywords] = useState<string>("");
  const [functionList, setFunctionList] = useState<Record<string, NodeFunction>>({});
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  useEffect(() => {
    const byCategory: NodePickerGroupCategory = {};

    setShowPath(keywords !== ""); // show path in node preview when searching

    const addFunctionToCategory = (categoryPath: string[], name: string, fn: NodeFunction) => {
      let currentLevel = byCategory;

      categoryPath.forEach((category, index) => {
        if (!currentLevel[category]) {
          currentLevel[category] = { functions: {}, subcategories: {} };
        }
        if (index === categoryPath.length - 1) {
          currentLevel[category].functions[name] = fn
        }
        currentLevel = currentLevel[category].subcategories;
      });
    };

    let matchedFunctions: Record<string, NodeFunction>;

    if (keywords) {
      const fuse = new Fuse(Object.entries(functions), {
        keys: ["0"], // Search by function name (keys are the names of functions)
        threshold: 0.4, // Adjust to fine-tune fuzzy search sensitivity
      });

      matchedFunctions = fuse
        .search(keywords)
        .reduce((acc: Record<string, NodeFunction>, result) => {
          const [name, fn] = result.item;
          acc[name] = fn;
          return acc;
        }, {});
    } else {
      matchedFunctions = { ...functions };
    }

    for (const [name, fn] of Object.entries(matchedFunctions)) {
      const categoryPath = fn.path.split("/");
      addFunctionToCategory(categoryPath, name, fn);
    }

    setFunctionList(matchedFunctions);
    setCategory(byCategory);
  }, [functions, keywords]);

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
            Object.entries(functionList).map(([name, fn]: [string, NodeFunction]) => (
              <NodeFunctionPickerButton
                key={name}
                fn={fn}
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