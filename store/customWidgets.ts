import { Widget, WidgetKey } from "@/types";

const customWidgets: Record<WidgetKey, Widget> = {
  Group: {
    path: "utils",
    fname: "", // not sent to server
    inputs: {
      required: {},
      optional: {}
    },
    outputs: {},
    display: false
  },
  Reroute: {
    path: "utils",
    fname: "", // not sent to server
    inputs: {
      required: {},
      optional: {}
    },
    outputs: {
      Output: {
        type: "Any"
      }
    },
    display: false
  },
};

export default customWidgets;
