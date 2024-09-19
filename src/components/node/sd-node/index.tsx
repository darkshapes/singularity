import React, { useEffect, useMemo, useState } from "react";
import { Node, NodeProps, useUpdateNodeInternals } from "reactflow";
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

import { useAppContext } from "@/store";
import { InputData, NodeFunction, NodeFunctionInputNecessity } from "@/types";

const SdNodeComponent = ({ id, data, selected }: NodeProps<NodeFunction>) => {
  const [enabledParams, setEnabledParams] = useState<NodeFunctionInputNecessity>({});
  const [swappedParams, setSwappedParams] = useState<any[]>([]);
  
  const updateNodeInternals = useUpdateNodeInternals();
  const { graph } = useAppContext(useShallow((s) => ({ graph: s.graph })));

  useEffect(() => {
    const enabledParamsList = Object.entries(data.inputs.optional).filter(([k, param]) => {
      if (!param.dependent) return true;

      const dependentOn = Object.entries({...data.inputs.required, ...data.inputs.optional}).find(
        ([name, input]) => input.fname == param.dependent?.on
      )?.[0] as string;

      return graph[id].fields[dependentOn] == param.dependent.when
    });

    setEnabledParams(enabledParamsList.reduce((acc, [k, v]) => {
      acc[k] = v;
      return acc;
    }, {} as NodeFunctionInputNecessity));
  }, [graph[id].fields])

  const swapItem = (item: any) => { // swap between params and inputs
    if (swappedParams.find(e => e.name === item.name)) {
      setSwappedParams(p => p.filter(e => e.name !== item.name));
    } else {
      setSwappedParams(p => [...p, item]);
    }
    updateNodeInternals(id);
  }

  const { expanded, onExpand } = useAppContext((s) => ({
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
          <NodeInputs data={data.inputs.required} selected={selected} />
          {/* <NodeSwappedParams data={swappedParams} selected={selected} swapItem={swapItem} /> */}
        </div>
        <NodeOutputs data={data.outputs} selected={selected} />
      </div>
        <Accordion
          type="multiple"
          value={isExpanded ? [id] : []}
          onValueChange={handleAccordionChange}
        >
          <AccordionItem value={id}>
            <AccordionTrigger />
            <AccordionContent className="m-0.5">
              <NodeParams data={enabledParams} nodeId={id} selected={selected} swapItem={swapItem} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      { data.display && <NodeDataDisplay id={id} /> }
    </>
  );
};

export const SdNode = React.memo(SdNodeComponent);
