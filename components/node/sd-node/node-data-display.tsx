import React, { useState, useCallback } from "react";
import { useShallow } from "zustand/react/shallow";

import { useAppStore } from "@/store";

interface NodeDataDisplayProps {
  id: string;
}

const NodeDataDisplayComponent = ({ id }: NodeDataDisplayProps) => {
  const [error, setError] = useState<boolean>(false);

  const { results } = useAppStore(useShallow((st) => ({ results: st.results })));
  const data = results[id];

  return (
    <div>
      {data}
    </div>
  )
};

export const NodeDataDisplay = React.memo(NodeDataDisplayComponent);
