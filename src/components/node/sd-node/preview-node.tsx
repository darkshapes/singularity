import React, { useMemo } from "react";
import { startCase } from "lodash-es";
import { motion } from "framer-motion";
import { type Widget } from "@/types";
import { NodeCard } from "./node-card";

interface SlotProps {
  required: 1 | 0;
  position: "left" | "right";
}

const Slot = ({ required, position }: SlotProps) => (
  <div
    className={`mt-1.5 react-flow__handle ${
      required ? "bg-primary" : "bg-border"
    } ${position === "left" ? "mr-2" : "ml-2"}`}
    style={{
      width: "12px",
      height: "12px",
      position: "absolute",
      [position]: -3,
    }}
  />
);

interface PreviewNodeProps {
  name: string; 
  data: Widget;
  showPath?: boolean;
  flipPath?: boolean;
}

const PreviewNodeComponent = ({ name, data, showPath }: PreviewNodeProps) => {
  const path = (data.path + "/").replaceAll("/", " › ");

  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
        duration: 0.15,
      }}
      className="w-[350px]"
    >
      <NodeCard title={name} path={showPath ? path : ""} active={false} preview={true}>
        <div className="flex w-full items-stretch justify-between space-x-6">
          <div className="flex-1">
            {Object.keys(data.inputs.required).map((name, index) => (
              <div key={index} className="flex items-center">
                <Slot position="left" required={1} />
                <span className="text-sm">{startCase(name)}</span>
              </div>
            ))}
          </div>
          <div className="flex-1 text-right">
            {Object.keys(data.outputs).map((name, index) => (
              <div key={index} className="flex items-center justify-end">
                <span className="text-sm">{startCase(name)}</span>
                <Slot position="right" required={1} />
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4">
          {Object.keys(data.inputs.optional).map((name, index) => (
            <div key={index} className="flex items-center">
              <span className="text-sm">{startCase(name)}</span>
            </div>
          ))}
        </div>
      </NodeCard>
    </motion.div>
  );
};

export const PreviewNode = React.memo(PreviewNodeComponent);
