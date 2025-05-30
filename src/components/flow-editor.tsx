import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ReactFlow,

  applyNodeChanges,
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  MiniMap,
  NodeChange,
  NodeProps,

  type Node,
  type Edge,
} from "@xyflow/react";
import { debounce } from "lodash-es";
import { useShallow } from "zustand/react/shallow";

import { useAppStore } from "@/store";

import { Node as NodeComponent } from "@/components/node";

import { AppInstance, AppNode } from "@/types";

import useUndoRedo from "@/hooks/use-undo-redo";

// import useForceLayout from "@/hooks/use-force-layout";

export type FlowEditorProps = {
  onInit: (e: AppInstance) => void;
}

export const FlowEditor = () => {
  // const { theme } = useTheme();
  // const edgeUpdateSuccessful = useRef(true);
  // const { takeSnapshot } = useUndoRedo();

  // useForceLayout({ strength, distance });

  const { 
    initialize,

    library,

    nodes,
    edges,

    onNodesChange,
    onEdgesChange,
    onConnect,

    onDrop,

    theme,
  } = useAppStore(useShallow((s) => ({ 
    initialize: s.initialize,

    library: s.library,

    nodes: s.nodes,
    edges: s.edges,

    onNodesChange: s.onNodesChange,
    onEdgesChange: s.onEdgesChange,
    onConnect: s.onConnect,

    onDrop: s.onDrop,

    theme: s.theme,
  })));
  // const {
  //   functions,
  //   onNodesChange,
  //   onEdgesChange,
  //   onSubmit,
  //   onConnect,
  //   onAddNode,
  //   onCopyNode,
  //   onPasteNode,
  //   onSetNodesGroup,
  //   onDeleteNode,
  //   onCreateGroup,
  // } = useAppStore(
  //   useShallow((s) => ({
  //     functions: s.functions,
  //     onInit: s.onInit,
  //     onNodesChange: debounce(s.onNodesChange, 1),
  //     onEdgesChange: debounce(s.onEdgesChange, 1),
  //     onSubmit: s.onSubmit,
  //     onConnect: s.onConnect,
  //     onAddNode: s.onAddNode,
  //     onCopyNode: s.onCopyNode,
  //     onPasteNode: s.onPasteNode,
  //     onSetNodesGroup: s.onSetNodesGroup,
  //     onDeleteNode: s.onDeleteNode,
  //     onCreateGroup: s.onCreateGroup,
  //   }))
  // );

  const nodeTypes = useMemo(() => 
    Object.keys(library).reduce((acc, name) => ({
      ...acc,
      [name]: NodeComponent,
    }), {} as Record<string, React.FC<NodeProps<AppNode>>>), 
  [library])

  const onDragOver = useCallback((event: any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  // const onNodeDrag: NodeDragHandler = useCallback(
  //   (_, node, nodes) => {
  //     // 👇 make dragging nodes undoable
  //     takeSnapshot();

  //     if (!instance) return;
  //     if (nodes.length > 2 || node.data.name !== "Group") return;
  //     const intersections = instance
  //       .getIntersectingNodes(node)
  //       .filter(
  //         (n: any) =>
  //           n.data.name !== "Group" &&
  //           (n.parentNode === node.id || !n.parentNode)
  //       )
  //       .map((n: any) => n.id);
  //   },
  //   [instance, takeSnapshot]
  // );

  // const handleCopy = useCallback(() => {
  //   const copyData = onCopyNode();
  //   navigator.clipboard.writeText(JSON.stringify(copyData));
  //   console.log("[Copy]", copyData);
  // }, [onCopyNode]);

  // const handlePaste = useCallback(async () => {
  //   try {
  //     const clipboardData = await navigator.clipboard.readText();
  //     const pasteData = JSON.parse(clipboardData);
  //     const position = getPostionCenter(reactFlowRef, instance);
  //     if (pasteData) onPasteNode(pasteData, position);
  //     console.log("[Paste]", pasteData, position);
  //   } catch (e) {
  //     console.log("[Paste]", e);
  //   }
  // }, [instance, onPasteNode]);

  // const handleKeyDown = useCallback(
  //   (event: KeyboardEvent) => {
  //     const ctrlKey = event.metaKey || (event.ctrlKey && !event.altKey);
  //     const ctrlAction: Record<string, () => void> = {
  //       KeyC: handleCopy,
  //       KeyV: handlePaste,
  //       KeyG: onCreateGroup,
  //       Enter: onSubmit,
  //     };
  //     if (ctrlKey) {
  //       const action = ctrlAction[event.code];
  //       if (action) action();
  //     }
  //   },
  //   [instance, handleCopy, handlePaste, onCreateGroup, onDeleteNode]
  // );

  // useEffect(() => {
  //   window.addEventListener("keydown", handleKeyDown);
  //   return () => {
  //     window.removeEventListener("keydown", handleKeyDown);
  //   };
  // }, [handleKeyDown]);

  return (
    <ReactFlow
      onInit={(e: AppInstance) => initialize(e)}

      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}

      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}

      // onNodesDelete={n => n.forEach((node: any) => onDeleteNode(node.id))}
      // onEdgeUpdate={onEdgeUpdate}
      // onEdgeUpdateStart={onEdgeUpdateStart}
      // onEdgeUpdateEnd={onEdgeUpdateEnd}
      // onNodeDragStart={onNodeDrag}

      onDrop={onDrop}
      onDragOver={(e) => e.preventDefault()}

      colorMode={theme}

      fitView
      snapGrid={[20, 20]}
      minZoom={0.05}
      zoomOnScroll={true}
      zoomOnPinch={true}
      connectOnClick={true}
      multiSelectionKeyCode={["Shift", "Control"]}
      deleteKeyCode={["Delete", "Backspace"]}
      disableKeyboardA11y={false}
      onlyRenderVisibleElements={true}
      attributionPosition="bottom-left"
    >
      <Background variant={BackgroundVariant.Dots} />
      <Controls showZoom={false} showInteractive={false} className="text-foreground hover:bg-primary hover:text-accent"/>
      <MiniMap
        position="bottom-left"
        // nodeColor={(n) =>
        //   // n.data.color || (theme === "light" ? "#3C4C63" : "#2C3E50")
        //   n.data.color || "#2C3E50"
        // }
        style={{ width: 150, height: 100 }}
      />
    </ReactFlow>
  );
};
