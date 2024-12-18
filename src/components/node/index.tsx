import React, { useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { NodeResizer, NodeProps } from "@xyflow/react";

import { useAppStore } from "@/store";
import { AppNode } from "@/types";
import { Input } from "@/components/ui/input";
import { ColorMenu, colorList } from "@/components/node/color-menu";
import { Progress } from "@/components/ui/progress";

import { SdNode } from "./sd-node";
import { NodeCard } from "./sd-node/node-card";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuSeparator,
} from "../ui/context-menu";
import {
  CopyIcon,
  Pencil1Icon,
  ShadowIcon,
  TrashIcon,
} from "@radix-ui/react-icons";

const NodeComponent = (props: NodeProps<AppNode>) => {
  const { id, data, type, selected } = props;
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [nicknameInput, setNicknameInput] = useState(false);

  const { progressBar } =
    useAppStore(
      useShallow((s) => ({
        progressBar:
          s.nodeInProgress?.id === id
            ? s.nodeInProgress?.progress
            : undefined
      }))
    );
  const isInProgress = progressBar !== undefined;
  // const isSelected = node.selected;

  const handleNickname = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nickname = e.target.value;
    data.modify({ nickname });
    setNicknameInput(false);
  };

  const handleNodeColor = (color: string) => {
    data.modify({ color });
  };

  useEffect(() => {
    if (ref.current) {
      const parent = ref.current.parentNode as HTMLElement;
      parent.setAttribute("type", type);
      ref.current.setAttribute("type", type);
    }
  }, [type]);

  useEffect(() => {
    if (nicknameInput && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 1); // hate this stupid ass hack but dunno how to fix
    }
  }, [nicknameInput]);

  const Title = () => {
    return (
      <div className="grid grid-cols-2 items-center w-full">
        {nicknameInput ? (
          <Input
            ref={inputRef}
            defaultValue={type}
            onKeyDown={(e) => {
              if (e.key === "Backspace") {
                e.stopPropagation();
              }
              if (["Enter", "Escape"].includes(e.key)) {
                (e.target as HTMLElement).blur()
              }
            }}
            onBlur={handleNickname}
            className="nodrag"
          />
        ) : (
          <div
            className={`w-fit ${
              isInProgress ? "animate-shimmer" : ""
            // } text-sm items-center justify-center rounded-full border border-opacity-40 dark:border-slate-800 bg-[linear-gradient(110deg,rgba(240,241,243,0.5),45%,rgba(254,254,254,0.5),55%,rgba(240,241,243,0.5))] dark:bg-[linear-gradient(110deg,rgba(0,1,3,0.5),45%,rgba(30,38,49,0.5),55%,rgba(0,1,3,0.5))] bg-[length:200%_100%]`}
            } text-xl`}
            onDoubleClick={() => setNicknameInput(true)}
          >
            {type}
          </div>
        )}

        {isInProgress
          ? progressBar > 0 && (
              <Progress
                className="absolute h-2 w-[40%] right-2 top-16 border"
                value={Math.floor(progressBar * 100)}
              />
            )
          : null}
      </div>
    );
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <NodeCard active={isInProgress} selected={selected} color={data?.modifiable?.color || ""} title={<Title />}>
          <SdNode { ...props } />
        </NodeCard>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem
          key="rename"
          onClick={() => setNicknameInput(true)}
          className="gap-1 text-xs"
        >
          <Pencil1Icon />
          Rename
        </ContextMenuItem>

        <ContextMenuSub key="colors">
          <ContextMenuSubTrigger className="gap-2 text-xs">
            <ShadowIcon />
            Color
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            {ColorMenu.map((child, index) => (
              <ContextMenuItem
                key={index}
                className="gap-2 text-xs"
                onClick={() => handleNodeColor(child.name as string)}
              >
                {child.name ? child.label : "None"}
                {/* @ts-ignore */}
                {child.name.charAt(0).toUpperCase() + child.name.slice(1)}
              </ContextMenuItem>
            ))}
          </ContextMenuSubContent>
        </ContextMenuSub>

        <ContextMenuSeparator />

        <ContextMenuItem
          key="copy"
          onClick={() => onDuplicateNode(node.id)}
          className="gap-1 text-xs"
        >
          <CopyIcon />
          Copy
        </ContextMenuItem>

        <ContextMenuItem
          key="delete"
          onClick={() => onDeleteNode(node.id)}
          className="gap-1 text-xs"
        >
          <TrashIcon />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export const Node = React.memo(NodeComponent);
