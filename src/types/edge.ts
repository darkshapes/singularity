import { FunctionComponentElement, createElement } from "react";
import { Edge } from "@xyflow/react";
import {
  BorderSolidIcon,
  CornerBottomRightIcon,
  DividerVerticalIcon,
} from "@radix-ui/react-icons";

export type EdgeType = {
  icon: FunctionComponentElement<any>;
  name: string;
}

export const edgeTypeList: EdgeType[] = [
  {
    icon: createElement(BorderSolidIcon),
    name: "smoothstep", // or "step"
  },
  {
    icon: createElement(DividerVerticalIcon),
    name: "straight",
  },
  {
    icon: createElement(CornerBottomRightIcon),
    name: "spline",
  },
];

export const defaultEdge = edgeTypeList[2];

export type AppEdge = Edge<EdgeType>;