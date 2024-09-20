import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { ReactFlowProvider } from "reactflow";

import '@fontsource/inter';
import '@public/globals.css';

import { cn } from "@/lib/utils";

import { AppInstance } from "@/types";

import { NodeContextMenu } from "@/components/node-menu";
import { ControlPanel } from "@/components/control-panel";
import { FlowEditor } from "@/components/flow-editor";
import { Toaster } from "@/components/toaster";

function App() {
  return (
        <div
          className={cn(
            "min-h-screen bg-background font-sans antialiased h-screen"
          )}
        >
          <Toaster />
          <ReactFlowProvider>
            <NodeContextMenu>
              <FlowEditor />
            </NodeContextMenu>
          </ReactFlowProvider>
          {/* <ControlPanel /> */}
        </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);