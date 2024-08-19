import { useAppStore } from "@/store";
import {
  InputDataStr,
  InputDataNumerical,
  InputDataSlider,
  InputDataLiteral,
  InputDataGeneric,
  InputData,
  
  NodeId
} from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { debounce } from "lodash-es";
import React, { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { SelectUploadInput } from "./select-upload-input";
import { SliderInput } from "./slider-input";
import { Textarea } from "@/components/ui/textarea";
import { ModelDrawer } from "../model-drawer";

interface InputParamsProps {
  id: NodeId;
  name: string;
  input: InputData;
}

const InputParamsComponent = ({ id, name, input }: InputParamsProps) => {
  const { graph, onPropChange } = useAppStore(
    useShallow((state) => ({
      graph: state.graph,
      onPropChange: state.onPropChange,
    }))
  );

  const value = graph[id]?.fields[name];
  const onChange = useMemo(
    () =>
      debounce((v: any) => {
        onPropChange(id, name, v)
      }, 100),
    [id, name, onPropChange]
  );

  const handleChange = (e: any) => onChange(e.target.value)

  if (input.type === "OneOf") {
    if (input.fname === "ckpt_name" || input.fname === "lora_name") {
      return <ModelDrawer 
        value={value}
        models={(input as InputDataLiteral).choices}
        type={name} 
        onChange={handleChange} 
      />;
    }

    return (
      <SelectUploadInput
        value={value}
        name={name}
        input={(input as InputDataLiteral).choices}
        onChange={(v: string) => onChange(v)}
      />
    );
  }

  if (input.type === "Bool") {
    return (
      <Checkbox
        value={value}
        defaultChecked={(input as InputDataGeneric<boolean>).default}
        onChange={handleChange}
      />
    );
  }

  if (input.type == "Int" || input.type == "Float") {
    if ((input as InputDataNumerical | InputDataSlider).display == "numerical") {
      return ( 
        <SliderInput // TODO: numerical input
          name={name.toLowerCase()}
          style={{ width: "100%" }}
          value={Number(value !== null ? value : (input as InputDataNumerical).default)}
          max={Number((input as InputDataNumerical).constraints?.max)}
          min={Number((input as InputDataNumerical).constraints?.min)}
          onChange={(v: number) => onChange(v)}
        />
      );
    } else if ((input as InputDataNumerical | InputDataSlider).display == "slider") {
      return (
        <SliderInput
          name={name.toLowerCase()}
          style={{ width: "100%" }}
          value={Number(value !== null ? value : (input as InputDataSlider).default)}
          max={Number((input as InputDataSlider).constraints?.max)}
          min={Number((input as InputDataSlider).constraints?.min)}
          onChange={(v: number) => onChange(v)}
        />
      );
    }
  }

  if (input.type = "Str") {
    return (
      <Textarea
        style={{ width: "100%" }}
        multiline={(input as InputDataStr).constraints?.multiline ?? false}
        defaultValue={value}
        onBlur={handleChange}
        onKeyDown={(e) => e.stopPropagation()}
      />
    );
  }

  return null;
};

export const InputParams = React.memo(InputParamsComponent);
