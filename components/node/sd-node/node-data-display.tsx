import React, { useState, useCallback } from "react";
import { useShallow } from "zustand/react/shallow";

import { useAppStore } from "@/store";

interface NodeDataDisplayProps {
  id: string;
}

const isBase64Image = (data: string): boolean => /^data:image\/(png|jpeg|jpg|gif|bmp|webp);base64,[a-zA-Z0-9+/]+={0,2}$/.test(data)

const NodeDataDisplayComponent = ({ id }: NodeDataDisplayProps) => {
  const { results } = useAppStore(useShallow((st) => ({ results: st.results })));
  const data = results[id];

  if (isBase64Image(data)) {
    return <img src={data} height={500} width={500} />
  }

  return (
    <div>
      {data}
    </div>
  )
};

export const NodeDataDisplay = React.memo(NodeDataDisplayComponent);
