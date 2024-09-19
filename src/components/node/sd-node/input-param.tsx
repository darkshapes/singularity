import { useAppContext } from "@/store";
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
  const { onPropChange } = useAppContext(
    useShallow((s) => ({
      onPropChange: s.onPropChange,
    }))
  );

  // const onChange = useMemo(
  //   () =>
  //     debounce((v: any) => {
  //       onPropChange(id, name, v)
  //     }, 100),
  //   [id, name, onPropChange]
  // );

    const onChange = useMemo(
    () =>
      (v: any) => {
        onPropChange(id, name, v)
      },
    [id, name, onPropChange]
  );

  const handleChange = (e: any) => onChange(e.target.value)

  if (input.type === "OneOf") {
    const i = input as InputDataLiteral;

    if (input.fname === "ckpt_name" || input.fname === "lora_name") {
      return <ModelDrawer 
        value={i.default}
        models={i.choices}
        type={name} 
        onChange={handleChange} 
      />;
    }

    return (
      <SelectUploadInput
        value={i.default}
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
        defaultChecked={i.default ?? false}
        onCheckedChange={(v: boolean) => onChange(v)}
      />
    );
  }

  if (input.type == "Int" || input.type == "Float") {
    const usi = input as InputDataNumerical | InputDataSlider;

    if (usi.display == "numerical") {
      const i = input as InputDataNumerical;

      return ( 
        <SliderInput // TODO: numerical input
          name={name.toLowerCase()}
          style={{ width: "100%" }}
          value={Number(i.default)}
          max={Number(i.constraints?.max)}
          min={Number(i.constraints?.min)}
          randomizable={i.constraints?.randomizable}
          onChange={(v: number) => onChange(v)}
        />
      );
    } else if (usi.display == "slider") {
      const i = input as InputDataSlider

      return (
        <SliderInput
          name={name.toLowerCase()}
          style={{ width: "100%" }}
          value={Number(i.default)}
          max={Number(i.constraints?.max)}
          min={Number(i.constraints?.min)}
          onChange={(v: number) => onChange(v)}
        />
      );
    }
  }

  if (input.type = "Str") {
    const i = input as InputDataStr;

    return (
      <Textarea
        style={{ width: "100%" }}
        multiline={i.constraints?.multiline}
        defaultValue={i.default}
        onBlur={handleChange}
        onKeyDown={(e) => e.stopPropagation()}
      />
    );
  }

  return null;
};

export const InputParams = React.memo(InputParamsComponent);
