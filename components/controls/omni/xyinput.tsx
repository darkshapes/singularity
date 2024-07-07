import React, { useState, useCallback } from 'react';
import {
  Tooltip,
  TooltipWithBounds,
  useTooltip,
  useTooltipInPortal,
  defaultStyles,
} from '@visx/tooltip';
import { motion, useAnimation } from "framer-motion";
import GridBG from "./pattern";

export type TooltipProps = {
  width: number;
  height: number;
  showControls?: boolean;
};

type TooltipData = string;

const positionIndicatorSize = 8;

const tooltipStyles = {
  ...defaultStyles,
  fontSize: "1.3vh",
  backgroundColor: 'rgba(0,0,0,0.5)',
  color: 'white',
  width: "flex",
  height: "flex",
  padding: 7,
};

declare const showIndicator: () => void;
// toggle indicator

export default function XYGrid({ width, height, showControls = true }: TooltipProps) {
  const [tooltipShouldDetectBounds, setTooltipShouldDetectBounds] = useState(true);
  const [renderTooltipInPortal, setRenderTooltipInPortal] = useState(false);

  const { containerRef, containerBounds, TooltipInPortal } = useTooltipInPortal({
    scroll: true,
    detectBounds: tooltipShouldDetectBounds,
  });

  const {
    showTooltip,
    hideTooltip,
    tooltipOpen,
    tooltipData,
    tooltipLeft = 0,
    tooltipTop = 0,
  } = useTooltip<TooltipData>({
    // initial tooltip state
    tooltipOpen: true,
    tooltipLeft: width / 3,
    tooltipTop: height / 3,
    // tooltipData: 'Move me with your mouse or finger',
  });

  // event handlers
  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      // coordinates should be relative to the container in which Tooltip is rendered
      const containerX = ('clientX' in event ? event.clientX : 0) - containerBounds.left;
       const containerY = ('clientY' in event ? event.clientY : 0) - containerBounds.top;
      showTooltip({
        tooltipLeft: containerX,
        tooltipTop: containerY,
        // tooltipData: tooltipShouldDetectBounds
        //  ? '' //'detect'
        //  : '' // 'clip',
      });
    },
    [showTooltip, tooltipShouldDetectBounds, containerBounds],
  );

  const TooltipComponent = renderTooltipInPortal
    ? TooltipInPortal
    : tooltipShouldDetectBounds
    ? TooltipWithBounds
    : Tooltip;

  return (
    <> 
      <div className="z-index-bg" style={{width}}> <GridBG width={width} height={height} /></div> 
        <div 
          id={"label"}
          ref={containerRef}
          className="tooltip-example drag-handle relative hover:shadow-lg"
          style={{ width, height, cursor: "none", }}
          onPointerMove={handlePointerMove}
          
          >
        {tooltipOpen ? (
          <>
            <div onClick={() => showIndicator()}
              className="position-indicator"
              style={{
                transform: `translate(${tooltipLeft - positionIndicatorSize / 2}px, ${
                  tooltipTop - positionIndicatorSize / 2}px)`,
              }}
            />
            <div
              className="crosshair horizontal"
              style={{ transform: `translateY(${tooltipTop}px)` }}
            />
            <div
              className="crosshair vertical"
              style={{ transform: `translateX(${tooltipLeft}px)` }}
            />
            <TooltipComponent
              key={Math.random()} // needed for bounds to update correctly
              left={tooltipLeft}
              top={tooltipTop}
              style={tooltipStyles}
            >
              {tooltipData}
              <strong>X</strong> {tooltipLeft?.toFixed(0)}&nbsp;&nbsp;
              <strong>Y</strong> {tooltipTop?.toFixed(0)}
            </TooltipComponent>
          </>
        ) : (
          <div className="no-tooltip">inactive</div>
        )}
              {showControls && (
        <div className="tooltip-controls" style={{ width }}>
          <label className="p-5">
           &nbsp; X / Y 
           </label>

        </div>
      )}
      <input className="ratio-control"
          type="checkbox" //toggle ratio lock
          // checked={tooltipShouldDetectBounds}
          // onChange={() => setTooltipShouldDetectBounds(!tooltipShouldDetectBounds)}
        />
      </div>
    <style>{`
      .tooltip-example {
        z-index: 1;
        top: 0%;
        left: 0%;
        position: absolute;
        overflow: hidden;
        border-radius: 16px;
        radius: 0.5rem;
        background: #222222aa;
        width: 100%;
        height: 100%;
      }
      .tooltip-controls {
        width: 100%;
        right: 1%;
        bottom: 0%;
        position: absolute;
        font-size: 1.3vh;
      }
      .ratio-control {
        left:93%;
        top:2%;
        position: absolute;
        font-size: 1.3vh;
        z-index: 0;
      }
      .position-indicator {
        width: ${positionIndicatorSize}px;
        height: ${positionIndicatorSize}px;
        border-radius: 50%;
        background: #ffffff;
        position: absolute;
      }
      .crosshair {
        position: absolute;
        top: 0;
        left: 0;
      }
      .crosshair.horizontal {
        width: 100%;
        height: 1px;
        border-top: 1px dashed #666666;
      }
      .crosshair.vertical {
        height: 100%;
        width: 1px;
        border-left: 1px dashed #666666;
      }
      .no-tooltip {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        font-size: 1.3vh;
      }
      .z-index-bg {
        position: absolute;
        z-index: 0;
        left: 0%;
        top: 0%;
        max-width: 90%;
        border-radius: 16px;
        line-height: 1.2em;
      }
      `}</style>
    </>
  );
}