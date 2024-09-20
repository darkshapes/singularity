import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useShallow } from "zustand/react/shallow";
import { Dices } from 'lucide-react';

import { Input } from "@/components/ui/input";
import { useAppStore } from "@/store";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";

interface SliderInputProps {
  name: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  randomizable?: boolean;
  style?: CSSProperties;
  onChange: (val: any) => void;
}

const SliderInputComponent: React.FC<SliderInputProps> = ({
  name,
  value,
  min,
  max,
  step,
  randomizable,
  style,
  onChange,
}) => {
  // const counter = useAppStore(useShallow((s) => s.counter));
  const [inputValue, setInputValue] = useState<number>(value);
  const [isRandom, setIsRandom] = useState<boolean>(false);

  const { iMax, iMin, iStep } = useMemo(() => {
    let computedMax = max;
    let computedMin = min;
    let computedStep = step ?? 1;
    switch (name) {
      case "steps":
        computedMax = 200;
        break;
      case "cfg":
        computedMax = 32;
        computedStep = 0.5;
        break;
      case "width":
      case "height":
        computedMax = 4096;
        computedMin = 512;
        computedStep = 4;
        break;
      default:
        break;
    }
    return { iMax: computedMax, iMin: computedMin, iStep: computedStep };
  }, [name, max, min, step]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement> | any) => {
      e.stopPropagation();

      const v = e.target.value
      if (v) {
        const n = Number(v);
        setInputValue(n);
        onChange(n);
      } else {
        setInputValue(v);
        onChange(v)
      }
    }, [onChange]
  );

  const onCheckedChange = useCallback((b: any) => {
    setIsRandom(b);
  }, []);

  const onBlur = useCallback(
    (e: React.ChangeEvent<HTMLInputElement> | any) => {
      e.stopPropagation();

      const v = e.target.value
      if (!isNaN(v)) {
        const n = Number(v);
        setInputValue(n);
        onChange(n);
      }
    }, [onChange]
  );

  // useEffect(() => {
  //   if (!randomizable || !isRandom) return;
  //   handleChange(Math.floor(Math.random() * iMax));
  // }, [counter, iMax]);

  return (
    <div style={style}>
      <div className={`flex flex-row items-center justify-between`}>
        <Input
          type="number"
          min={iMin}
          max={iMax}
          step={iStep}
          value={inputValue}
          onChange={handleChange}
          onBlur={onBlur}
          className="nodrag min-w-[50px] text-muted-foreground focus:text-accent-foreground"
        />

        {randomizable && (
          <Checkbox checked={isRandom} onCheckedChange={onCheckedChange} className="m-1 w-6 h-6">
            <Dices strokeWidth={1} />
          </Checkbox>
        )}
      </div>
    </div>
  );
};

export const SliderInput = React.memo(SliderInputComponent);
