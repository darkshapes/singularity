import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { ReactFlowProvider } from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import '@fontsource/inter';
import '@public/globals.css';

import { useAppStore } from "@/store";

import { cn } from "@/lib/utils";

import { NodeContextMenu } from "@/components/node-menu";
import { ControlPanel } from "@/components/control-panel";
import { FlowEditor } from "@/components/flow-editor";
import { Toaster } from "@/components/toaster";

function App() {
  const { theme } = useAppStore((s) => ({ theme: s.theme }));

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <div
      className="min-h-screen bg-background font-sans antialiased h-screen"
    >
      <Toaster />
      <ReactFlowProvider>
        <NodeContextMenu>
          <FlowEditor />
        </NodeContextMenu>
      </ReactFlowProvider>
      <ControlPanel />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);