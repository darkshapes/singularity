import {
  BorderSolidIcon,
  CornerBottomRightIcon,
  DividerVerticalIcon
} from "@radix-ui/react-icons";

export type WidgetKey = string;
export type PropertyKey = string;
export type NodeId = string;

export type EdgeType = {
  icon: JSX.Element;
  name: string;
}

export const edgeTypeList: EdgeType[] = [
  {
    icon: <BorderSolidIcon />,
    name: "smoothstep", // or "step"
  },
  {
    icon: <DividerVerticalIcon />,
    name: "straight",
  },
  {
    icon: <CornerBottomRightIcon />,
    name: "spline",
  },
];
