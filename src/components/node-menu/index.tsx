import { useEffect, useState } from "react";
import { NodeFunction } from "@/types";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuPortal,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { NodePicker } from "./node-picker";
import { PreviewNode } from "../node/sd-node/preview-node";

export const NodeContextMenu = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [activeItem, setActiveItem] = useState<{name: string; fn: NodeFunction} | null>(null);
  const [showPath, setShowPath] = useState<boolean>(false);
  const [previewPosition, setPreviewPosition] = useState<{x: string, y: string}>({x: 'right', y: 'bottom'});
  const [flipPath, setFlipPath] = useState<boolean>(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      if (e.clientX > window.innerWidth * 2 / 3) {
        setPreviewPosition({x: 'left', y: 'top'});
        setFlipPath(true);
      } else {
        setPreviewPosition({x: 'right', y: 'bottom'});
        setFlipPath(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  return (
  <>
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="overflow-auto">
        <NodePicker setActiveItem={setActiveItem} setShowPath={setShowPath} />
      </ContextMenuContent>
    </ContextMenu>
    { activeItem !== null && 
      <div className={`fixed z-[60] ${previewPosition.x}-0 ${previewPosition.y}-0 text-accent-foreground bg-muted/50 p-8 rounded-lg border backdrop-blur-sm`}>
        <PreviewNode name={activeItem.name} data={activeItem.fn} showPath={showPath} flipPath={flipPath} />
      </div>
    }
  </>
  );
}
