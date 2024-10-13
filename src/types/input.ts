// Annotation class types

export interface SliderProps<A> {
  min: A;
  max: A;
  step: A;
  round: boolean;
}

export interface NumericalProps<A> extends SliderProps<A> {
  randomizable: boolean;
}

export interface TextProps {
  multiline: boolean;
  dynamic_prompt: boolean;
}

export interface DependentProps {
  on: string; // will be fname of the variable it depends on
  when: any;

  satisfied: boolean; // this doesn't come from the server, it's a local attribute that we calculate
}

// Type constraint types

export interface StringConstraint {
  constraints?: TextProps;
}

export interface NumericalConstraint {
  constraints?: NumericalProps<number>;
  display: "numerical";
}

export interface SliderConstraint {
  constraints?: SliderProps<number>;
  display: "slider";
}

// Input types

export interface InputBase<A> {
  fname: string; // true name of variable on serverside
  default?: A;
  value?: A;
  dependent?: DependentProps;
}

export interface InputDataStr extends InputBase<string>, StringConstraint {
  type: "Str";
}

export interface InputDataNumerical extends InputBase<number>, NumericalConstraint {
  type: "Int" | "Float";
}

export interface InputDataSlider extends InputBase<number>, SliderConstraint {
  type: "Int" | "Float";
}

export interface InputDataLiteral extends InputBase<any> {
  type: "OneOf";
  choices: any[];
}

export interface InputDataGeneric<A> extends InputBase<A> {
  type: string;
}

export type InputData = InputDataStr | InputDataNumerical | InputDataSlider | InputDataLiteral | InputDataGeneric<any>;

export type FieldData = InputData & { value?: any };