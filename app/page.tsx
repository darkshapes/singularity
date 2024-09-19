import { useRef } from "react";

import { ReactFlowProvider } from "reactflow";

import { AppProvider } from "@/app/store/provider";
import { AppInstance } from "@/types";

import { NodeContextMenu } from "@/components/node-menu";
import { ControlPanel } from "@/components/control-panel";
import { FlowEditor } from "@/components/flow-editor";
import { Toaster } from "@/components/toaster";

export default function Home() {
  const instance = useRef<AppInstance | null>(null);

  const onInit = (e: AppInstance) => {
    instance.current = e;
  }

  return (
    <AppProvider instance={instance.current}>
      <div className="h-screen">
        <Toaster />
        <ReactFlowProvider>
          <NodeContextMenu>
            <FlowEditor onInit={onInit} />
          </NodeContextMenu>
        </ReactFlowProvider>
        <ControlPanel />
      </div>
    </AppProvider>
  );
}
