import { Widget, WidgetKey } from "@/types";

const customWidgets: Record<WidgetKey, Widget> = {
  Group: {
    path: "utils/",
    fname: "", // not sent to server
    inputs: {
      required: {},
      optional: {}
    },
    outputs: {}
  },
  Reroute: {
    path: "utils/",
    fname: "", // not sent to server
    inputs: {
      required: {},
      optional: {}
    },
    outputs: {
      Output: "Any"
    }
  },
};

export default customWidgets;
