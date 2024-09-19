import '@fontsource/inter/variable.css';
import '@public/globals.css';

import React, { useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { ReactFlowProvider } from "reactflow";

import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";

import { AppProvider } from "@/app/store/provider";
import { AppInstance } from "@/types";

import { NodeContextMenu } from "@/components/node-menu";
import { ControlPanel } from "@/components/control-panel";
import { FlowEditor } from "@/components/flow-editor";
import { Toaster } from "@/components/toaster";

function App() {
  const instance = useRef<AppInstance | null>(null);

  const onInit = (e: AppInstance) => {
    instance.current = e;
  };

  return (
    <ThemeProvider attribute="class" enableSystem>
      <AppProvider instance={instance.current}>
        <div
          className={cn(
            "min-h-screen bg-background font-sans antialiased h-screen"
          )}
        >
          <Toaster />
          <ReactFlowProvider>
            <NodeContextMenu>
              <FlowEditor onInit={onInit} />
            </NodeContextMenu>
          </ReactFlowProvider>
          <ControlPanel />
        </div>
      </AppProvider>
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);