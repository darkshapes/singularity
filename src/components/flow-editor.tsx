import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
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
} from "@xyflow/react"
import { debounce } from "lodash-es"
import { useShallow } from "zustand/react/shallow"

import { useAppStore } from "@/store"

import { Node as NodeComponent } from "@/components/node"

import { AppInstance, AppNode } from "@/types"

import useUndoRedo from "@/hooks/use-undo-redo"


export type FlowEditorProps = {
  onInit: (e: AppInstance) => void
}

export const FlowEditor = () => {


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
  })))


  const nodeTypes = useMemo(() =>
    Object.keys(library).reduce((acc, name) => ({
      ...acc,
      [name]: NodeComponent,
    }), {} as Record<string, React.FC<NodeProps<AppNode>>>),
    [library])

  const onDragOver = useCallback((event: any) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }, [])

  return (
    <ReactFlow
      onInit={(e: AppInstance) => initialize(e)}

      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}

      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}

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
      <Controls showZoom={false} showInteractive={false} className="text-foreground hover:bg-primary hover:text-accent" />
      <MiniMap
        position="bottom-left"

        style={{ width: 150, height: 100 }}
      />
    </ReactFlow>
  )
}
