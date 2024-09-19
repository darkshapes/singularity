import {
  BorderSolidIcon,
  CornerBottomRightIcon,
  DividerVerticalIcon
} from "@radix-ui/react-icons";

export type EdgeType = {
  icon: typeof BorderSolidIcon | typeof CornerBottomRightIcon | typeof DividerVerticalIcon;
  name: string;
}

export const edgeTypeList: EdgeType[] = [
  {
    icon: BorderSolidIcon,
    name: "smoothstep", // or "step"
  },
  {
    icon: DividerVerticalIcon,
    name: "straight",
  },
  {
    icon: CornerBottomRightIcon,
    name: "spline",
  },
];
