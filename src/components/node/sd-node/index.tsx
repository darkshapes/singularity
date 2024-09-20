import React, { useEffect, useMemo, useState } from "react";
import { Node, NodeProps, useUpdateNodeInternals } from "@xyflow/react";
import { useShallow } from "zustand/react/shallow";

import { NodeDataDisplay } from "./node-data-display";
import { NodeInputs } from "./node-inputs";
import { NodeOutputs } from "./node-outputs";
import { NodeSwappedParams, NodeParams } from "./node-params";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { useAppStore } from "@/store";
import { AppNode, NodeFunctionInputNecessity } from "@/types";

const SdNodeComponent = ({ id, data, selected }: NodeProps<AppNode>) => {
  const [enabledParams, setEnabledParams] = useState<NodeFunctionInputNecessity>({});
  const [swappedParams, setSwappedParams] = useState<any[]>([]);
  
  const updateNodeInternals = useUpdateNodeInternals();
  const { getNode } = useAppStore(useShallow((s) => ({ getNode: s.getNode })));

  useEffect(() => {
    const enabledParamsList = Object.entries(data.fn.inputs.optional).filter(([k, param]) => {
      if (!param.dependent) return true;

      const dependentOn = Object.entries({...data.fn.inputs.required, ...data.fn.inputs.optional}).find(
        ([name, input]) => input.fname == param.dependent?.on
      )?.[0] as string;

      return getNode(id)?.data.fields[dependentOn] == param.dependent.when
    });

    setEnabledParams(enabledParamsList.reduce((acc, [k, v]) => {
      acc[k] = v;
      return acc;
    }, {} as NodeFunctionInputNecessity));
  }, [data.fields])

  const swapItem = (item: any) => { // swap between params and inputs
    if (swappedParams.find(e => e.name === item.name)) {
      setSwappedParams(p => p.filter(e => e.name !== item.name));
    } else {
      setSwappedParams(p => [...p, item]);
    }
    updateNodeInternals(id);
  }

  const { expanded, onExpand } = useAppStore((s) => ({
    expanded: s.expanded,
    onExpand: s.onExpand,
  }));
  // Determine if the current node's accordion should be expanded
  const isExpanded = expanded.includes(id);
  const handleAccordionChange = () => onExpand(id);

  return (
    <>
      <div className="flex items-stretch justify-stretch w-full space-x-6">
        <div className="flex-1">
          <NodeInputs data={data.fn.inputs.required} selected={selected ?? false} />
          {/* <NodeSwappedParams data={swappedParams} selected={selected} swapItem={swapItem} /> */}
        </div>
        <NodeOutputs data={data.fn.outputs} selected={selected ?? false} />
      </div>
        <Accordion
          type="multiple"
          value={isExpanded ? [id] : []}
          onValueChange={handleAccordionChange}
        >
          <AccordionItem value={id}>
            <AccordionTrigger />
            <AccordionContent className="m-0.5">
              <NodeParams data={enabledParams} nodeId={id} selected={selected ?? false} swapItem={swapItem} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      { data.fn.display && <NodeDataDisplay id={id} /> }
    </>
  );
};

export const SdNode = React.memo(SdNodeComponent);
