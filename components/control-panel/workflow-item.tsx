import React, { useCallback, useState } from "react";
import { clsx } from "clsx";
import type { LocalPersistedGraphs, PersistedGraph } from "@/types";
import { MaskOffIcon, ClockIcon, Cross1Icon, DownloadIcon, InputIcon, Link2Icon, Pencil2Icon } from "@radix-ui/react-icons";
import { writeWorkflowToFile } from "@/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { NodeRendererProps } from "react-arborist";

// interface WorkflowItemProps {
//   item: LocalPersistedGraphs;
//   index: number;
//   handleRename: (id: string, title: string) => void;
//   handleUpdate: (id: string, title: string) => void;
//   handleDelete: (id: string, title: string) => void;
//   handleLoad: (graph: PersistedGraph, title: string) => void;
// }



const WorkflowItemComponent: React.FC<NodeRendererProps<any>> = ({
  node,
  style,
  dragHandle
}) => {
  const [showRename, setShowRename] = useState(false);

  // const handleRenameDone = useCallback(
  //   (e: any) => {
  //     setShowRename(false);
  //     const newTitle = e.target.value;
  //     if (newTitle) handleRename(node.id, newTitle);
  //   },
  //   [handleRename, node.id]
  // );

  // const handleLoadClick = useCallback(() => {
  //   handleLoad(node.data.graph, node.data.name);
  // }, [handleLoad, node.data.graph, node.data.name]);

  // const handleEditClick = useCallback(() => {
  //   setShowRename(!showRename);
  // }, [showRename]);

  // const handleUpdateClick = useCallback(() => {
  //   handleUpdate(node.id, node.data.name);
  // }, [handleUpdate, node.id, node.data.name]);

  // const handleDownloadClick = useCallback(() => {
  //   writeWorkflowToFile(node.data.graph, node.data.name);
  // }, [node.data.graph, node.data.name]);

  // const handleDeleteClick = useCallback(() => {
  //   handleDelete(node.id, node.data.name);
  // }, [handleDelete, node.id, node.data.name]);

  const renderTitle = useCallback(() => {
    if (showRename) {
      return <Input defaultValue={node.data.name}
        className="text-accent-foreground"
        autoFocus={true}
        // onBlur={handleRenameDone} 
        onKeyDown={e => ["Enter"].includes(e.key) && (e.target as HTMLElement).blur()} 
      />;
    } else {
      return (
        <Tooltip>
            <TooltipTrigger asChild>
        <a className="flex overflow-hidden w-full" title="Load" 
          // onClick={handleLoadClick}
        >
          {node.data.name}
        </a>
        </TooltipTrigger>
        <TooltipContent>Load</TooltipContent>
       </Tooltip>
      );
    }
  }, [showRename, node.data.name, 
    // handleRenameDone, handleLoadClick
  ]);

  return (
      <ul
        style={style}
        className={clsx("list-none p-0 m-0", node.state)}
        onClick={() => node.isInternal && node.toggle()}
      >
        <li key={node.id} className="last:border-b-0">
          <div className="flex flex-col justify-between overflow-hidden" ref={dragHandle}>
            <div className="flex justify-between">
                <div className="text-muted-foreground w-full overflow-hidden hover:text-secondary h-7 m-1 p-1 flex items-center cursor-default [&>span]:line-clamp-1" title="Load Workflow" style={{borderRadius: '5px'}}>
                    <span
                      title="Load"
                      className="flex items-center space-x-3 my-4 p-1 text-sm overflow-hidden w-full hover:bg-muted hover:text-foreground whitespace-nowrap"
                      style={{borderRadius: '5px'}}
                    >{renderTitle()}</span>
              </div>
              <div className="flex justify-end items-center">
                {/* <Tooltip>
                  <TooltipTrigger asChild>
                    <Button className="workflow-button hover:bg-muted hover:text-foreground"  size="narrow" 
                      // onClick={handleEditClick}
                    >
                      <InputIcon />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Rename workflow</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button className="workflow-button hover:bg-muted hover:text-foreground"  size="narrow" 
                      // onClick={handleUpdateClick}
                    >
                      <Pencil2Icon />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Overwrite with current</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button className="workflow-button hover:bg-muted hover:text-foreground" size="narrow"  
                      // onClick={handleDownloadClick}
                    >
                      <DownloadIcon />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Download to disk</TooltipContent>
                </Tooltip> */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button className="workflow-button hover:bg-muted hover:text-foreground" size="narrow" 
                      // onClick={handleDeleteClick}
                    >
                      <Cross1Icon />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Delete workflow</TooltipContent>
                </Tooltip>
              </div>
            </div>
            {/* <div className="text-sm text-gray-600">
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <MaskOffIcon />
                    <span>{Object.keys(node.data.graph.data).length}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link2Icon />
                    <span>{node.data.graph.connections.length}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ClockIcon />
                    <span>
                      {(() => {
                        const date = new Date(node.data.time);
                        const formattedDate =
                          date.getFullYear() +
                          "-" +
                          ("0" + (date.getMonth() + 1)).slice(-2) +
                          "-" +
                          ("0" + date.getDate()).slice(-2) +
                          " " +
                          ("0" + date.getHours()).slice(-2) +
                          ":" +
                          ("0" + date.getMinutes()).slice(-2) +
                          ":" +
                          ("0" + date.getSeconds()).slice(-2);
                        return formattedDate;
                      })()}
                    </span>
                  </div>
                </div>
              </div> */}
          </div>
        </li>
      </ul>
  );
};

export const WorkflowItem = React.memo(WorkflowItemComponent);
