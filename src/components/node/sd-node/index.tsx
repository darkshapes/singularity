import React, { useEffect, useMemo, useState } from "react";
import { Node, NodeProps, useUpdateNodeInternals } from "@xyflow/react";

import { NodeDataDisplay } from "./node-data-display";
import { NodeInputs } from "./node-inputs";
import { NodeOutputs } from "./node-outputs";
import { NodeParams } from "./node-params";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { AppNode, NodeOrderedFields } from "@/types";

const SdNodeComponent = ({ id, data, selected }: NodeProps<AppNode>) => {
  const [enabledParams, setEnabledParams] = useState<NodeOrderedFields>([]);

  useEffect(() => {
    if (!data.fields || !data.order) return;

    const enabledParamsList: NodeOrderedFields = Object.entries(data.fields).filter(([k, param]) => {
      if (!param.dependent) return true;

      const dependentOn = Object.entries({...data.fn.inputs.required, ...data.fn.inputs.optional}).find(
        ([name, input]) => input.fname == param.dependent?.on
      )?.[0] as string;

      return data.fields?.[dependentOn]  == param.dependent.when
    });

    setEnabledParams(data.order
      .map((key: PropertyKey) => enabledParamsList.find(([enabledKey]) => enabledKey === key))
      .filter(Boolean) as NodeOrderedFields
    )
  }, [data.fields])

  const handleAccordionChange = () => {
    data.modify({ expanded: !data.modifiable?.expanded });
  };

  return (
    <>
      <div className="flex items-stretch justify-stretch w-full space-x-6">
        <div className="flex-1">
          <NodeInputs data={data.fn.inputs.required} selected={selected ?? false} swap={data.swap} />
        </div>
        <NodeOutputs data={data.fn.outputs} selected={selected ?? false} />
      </div>
      { Object.keys(data.fn.inputs.optional).length > 0 &&
        <Accordion
          type="multiple"
          value={data.modifiable?.expanded ? [id] : []}
          onValueChange={handleAccordionChange}
        >
          <AccordionItem value={id}>
            <AccordionTrigger />
            <AccordionContent className="m-0.5">
              <NodeParams data={enabledParams} selected={selected ?? false} swap={data.swap} update={data.update} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      }
      { data.fn.display && <NodeDataDisplay id={id} /> }
    </>
  );
};

export const SdNode = React.memo(SdNodeComponent);
