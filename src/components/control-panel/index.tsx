import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogTrigger } from '@radix-ui/react-dialog';
import { Button } from "@/components/ui/button";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { PlayIcon, FilePlusIcon, ChevronDownIcon, ChevronUpIcon, TrashIcon, GearIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { WorkflowPage } from "./workflow-page";
import { ClearDialog } from "./clear-dialog";
import { SettingsModal } from "./settings-modal";
import { useAppStore } from "@/store";
import { useShallow } from "zustand/react/shallow";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const nodes = [
  {
    text: "CheckpointLoaderSimple",
  },
  {
    text: "KSampler",
  },
];

const TooltipButton = ({ content, children }: any) => 
  <Tooltip>
    <TooltipTrigger asChild>
      {children}
    </TooltipTrigger>
    <TooltipContent side="left" className="text-xs">
      {content}
    </TooltipContent>
  </Tooltip>

const PromptButtonComponent = () => {
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);

  const { onSubmit, promptError, onEdgesAnimate } = useAppStore(
      useShallow((s) => ({
        onSubmit: s.onSubmit,
        promptError: s.promptError,
        onEdgesAnimate: s.onEdgesAnimate,
      }))
    );

  useEffect(() => {
    if (promptError !== undefined) {
      toast.error(promptError);
    }
  }, [promptError, count]);

  const handleRun = useCallback(() => {
    setLoading(true);
    onSubmit();
    setCount((prevCount) => prevCount + 1);
  }, [onSubmit]);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          className={cn(
            "relative h-12 w-12 rounded-3xl shadow-lg bg-gradient-to-b text-foreground text-background dark:from-white dark:to-blue-50 ring-2 ring-blue-50 ring-opacity-60",
            "from-slate-800 to-slate-700 ring-slate-400",
            "hover:rounded-lg transition-all duration-200"
          )}
          onClick={handleRun}
        >
          <PlayIcon />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="left" className="text-xs bg-foreground text-background">
        Start prompt
      </TooltipContent>
    </Tooltip>
  );
};

export const PromptButton = React.memo(PromptButtonComponent);

const ControlPanelComponent = () => {
  const { nodes, toggleTheme } = useAppStore((s) => ({ nodes: s.nodes, toggleTheme: s.toggleTheme }));

  const checkExpanded = () => nodes.every(node => node.data.modifiable?.expanded ?? true);

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(checkExpanded());
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  useEffect(() => {
    setIsExpanded(checkExpanded());
  }, [nodes])

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
    nodes.forEach(node => node.data.modify({ expanded: !isExpanded }))
  }

  return (
    <TooltipProvider delayDuration={0}>
      <div className="fixed right-4 top-4 flex flex-col gap-3 m-2">
        <PromptButton />
        <Sheet modal={true} open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <TooltipButton content="Save/load workflows">
                <SheetTrigger asChild>
                  <Button
                    onClick={() => setIsSheetOpen(!isSheetOpen)}
                    className="relative rounded-3xl shadow-lg hover:bg-accent hover:rounded-lg transition-all duration-200 h-12 w-12"
                    variant="outline"
                  >
                    <FilePlusIcon />
                  </Button>
                </SheetTrigger>
              </TooltipButton>
          <SheetContent side={"left"} className="overflow-auto">
            <WorkflowPage />
          </SheetContent>
        </Sheet>

        <TooltipButton content="Show/hide controls">
          <Button
            onClick={() => handleExpand()}
            className="relative rounded-3xl shadow-lg hover:bg-accent hover:rounded-lg transition-all duration-200 h-12 w-12"
            variant="outline"
          >
            {isExpanded ? <ChevronUpIcon />  : <ChevronDownIcon />}
          </Button>
        </TooltipButton>
        <Dialog open={isClearDialogOpen} onOpenChange={setIsClearDialogOpen}>
          <TooltipButton content="Clear graph">
            <DialogTrigger asChild>
              <Button
                onClick={() => setIsClearDialogOpen(true)}
                className="relative rounded-3xl shadow-lg hover:bg-accent hover:rounded-lg transition-all duration-200 h-12 w-12"
                variant="outline"
              >
                <TrashIcon />
              </Button>
            </DialogTrigger>
          </TooltipButton>
          <ClearDialog setOpen={setIsClearDialogOpen} />
        </Dialog>
        <Dialog open={isSettingsModalOpen} onOpenChange={setIsSettingsModalOpen}>
          <TooltipButton content="Settings">
            <DialogTrigger asChild>
              <Button
                onClick={() => {}}
                className="relative rounded-3xl shadow-lg hover:bg-accent hover:rounded-lg transition-all duration-200 h-12 w-12"
                variant="outline"
              >
                <GearIcon />
              </Button>
            </DialogTrigger>
          </TooltipButton>
          <SettingsModal open={isSettingsModalOpen} setOpen={setIsSettingsModalOpen} />
        </Dialog>
        <TooltipButton content="Toggle theme">
          <Button
            onClick={() => toggleTheme()}
            className="relative rounded-3xl shadow-lg hover:bg-accent hover:rounded-lg transition-all duration-200 h-12 w-12"
            variant="outline"
          >
            <MoonIcon className="h-[1rem] w-[1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <SunIcon className="absolute h-[1rem] w-[1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
        </TooltipButton>
      </div>
    </TooltipProvider>
  );
};

export const ControlPanel = React.memo(ControlPanelComponent);
