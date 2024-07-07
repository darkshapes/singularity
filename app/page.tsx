"use client";

import { ReactFlowProvider } from "reactflow";

import { NodeContextMenu } from "@/components/node-menu";
import { ControlPanel } from "@/components/control-panel";
import { FlowEditor } from "@/components/flow-editor";
import { Toaster } from "@/components/toaster";
import XYGrid from "@/components/omni/xy";

export default function Home() {
  return (
    <div className="h-screen">
      <Toaster />
      <ReactFlowProvider>
        <NodeContextMenu>
          <FlowEditor />
          <XYGrid  width={300} height={300} />
        </NodeContextMenu>
      </ReactFlowProvider>
      <ControlPanel />
    </div>
  );
}
