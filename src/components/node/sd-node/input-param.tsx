import { useAppStore } from "@/store";
import {
  FieldData,

  InputDataStr,
  InputDataNumerical,
  InputDataSlider,
  InputDataLiteral,
  InputDataGeneric,
  
  NodeUpdate
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
  name: string;
  input: FieldData;
  update: NodeUpdate;
}

const InputParamsComponent = ({ name, input, update }: InputParamsProps) => {
  const setValue = (v: any) => update({ [name]: { value: v } }); // 100 ms debounce here?

  const onChange = useMemo(() => setValue, [name]);

  const handleChange = (e: any) => onChange(e.target.value)

  setValue(input.value ?? input.default);

  if (input.type === "OneOf") {
    const i = input as InputDataLiteral;

    if (input.fname === "ckpt_name" || input.fname === "lora_name") {
      return <ModelDrawer 
        value={i.value}
        models={i.choices}
        type={name} 
        onChange={handleChange} 
      />;
    }

    return (
      <SelectUploadInput
        value={i.value}
        name={name}
        input={i.choices}
        onChange={(v: string) => onChange(v)}
      />
    );
  }

  if (input.type === "Bool") {
    const i = input as InputDataGeneric<boolean>;

    return (
      <Checkbox
        defaultChecked={i.value ?? false}
        onCheckedChange={(v: boolean) => onChange(v)}
      />
    );
  }

  if (input.type === "Int" || input.type === "Float") {
    const usi = input as InputDataNumerical | InputDataSlider;

    if (usi.display === "numerical") {
      const i = input as InputDataNumerical;

      return ( 
        <SliderInput // TODO: numerical input
          name={name.toLowerCase()}
          style={{ width: "100%" }}
          value={Number(i.value)}
          max={Number(i.constraints?.max)}
          min={Number(i.constraints?.min)}
          randomizable={i.constraints?.randomizable}
          onChange={(v: number) => onChange(v)}
        />
      );
    } else if (usi.display === "slider") {
      const i = input as InputDataSlider

      return (
        <SliderInput
          name={name.toLowerCase()}
          style={{ width: "100%" }}
          value={Number(i.value)}
          max={Number(i.constraints?.max)}
          min={Number(i.constraints?.min)}
          onChange={(v: number) => onChange(v)}
        />
      );
    }
  }

  if (input.type === "Str") {
    const i = input as InputDataStr;

    return (
      <Textarea
        style={{ width: "100%" }}
        multiline={i.constraints?.multiline}
        defaultValue={i.value}
        onBlur={handleChange}
        onKeyDown={(e) => e.stopPropagation()}
      />
    );
  }

  return null;
};

export const InputParams = React.memo(InputParamsComponent);
