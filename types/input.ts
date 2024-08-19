// Annotation class types

export interface SliderProps<A> {
  min: A;
  max: A;
  step: A;
  round: boolean;
}

export interface NumericalProps<A> extends SliderProps<A> {
  randomize: boolean;
}

export interface TextProps {
  multiline: boolean;
  dynamic_prompt: boolean;
}

export interface DependentProps {
  on: string;
  when: any;
}

// Type constraint types

export interface StringConstraint {
  type: "Str";
  constraints: TextProps;
}

export interface NumericalConstraint {
  constraints?: NumericalProps<number>;
  display?: "numerical";
}

export interface SliderConstraint {
  constraints?: SliderProps<number>;
  display?: "slider";
}

// Input types

export interface InputBase<A> {
  default?: A;
  dependent?: DependentProps;
}

export interface InputDataStr extends InputBase<string> {
  type: "Str";
  constraints?: StringConstraint;
}

export interface InputDataNumerical extends InputBase<number>, NumericalConstraint {
  type: "Int" | "Float";
}

export interface InputDataSlider extends InputBase<number>, SliderConstraint {
  type: "Int" | "Float";
}

export interface InputDataAny extends InputBase<any> {
  type: string;
}

export type InputData = InputDataStr | InputDataNumerical | InputDataSlider | InputDataAny;