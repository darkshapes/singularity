import React from 'react';
import { Bar } from '@visx/shape';
import { Group } from '@visx/group';
import {
 // Pattern as CustomPattern,
  PatternLines,
 // PatternCircles,
 // PatternWaves,
} from '@visx/pattern';

const marginSize = 10;

const defaultMargin = {
  top: marginSize,
  left: marginSize,
  right: marginSize,
  bottom: marginSize,
};

export type PatternProps = {
  width: number;
  height: number;
  margin?: typeof defaultMargin;
};

const Patterns: React.FC<{ id: string; prefersReducedMotion?: boolean }>[] = [
  ({ id }) => (
    <PatternLines
      id={id}
      height={20}
      width={20}
      stroke="#BFBFBF"
      strokeWidth={1}
      orientation={['diagonal']}
    />
    )
];

export default function GridBG({ width, height, margin = defaultMargin }: PatternProps) {
  // use non-animated components if prefers-reduced-motion is set
  //const prefersReducedMotionQuery =
  //  typeof window === 'undefined' ? true : window.matchMedia('(prefers-reduced-motion: reduce)');
  //const prefersReducedMotion = !prefersReducedMotionQuery || !!prefersReducedMotionQuery.matches;

  const numColumns = 1;
  const numRows = Patterns.length / numColumns;
  const columnWidth = Math.max((width - margin.left - margin.right) / numColumns, 0);
  const rowHeight = Math.max((height - margin.bottom - margin.top) / numRows, 0);

  return width >= 10 ? (
    <svg width={width} height={height}>
      <rect x={0} y={0} width={width} height={height} fill="#00000000" rx={14} />
      <Group top={margin.top} left={margin.left}>
        {Patterns.map((Pattern, index) => {
          const columnIndex = index % numColumns;
          const rowIndex = Math.floor(index / numColumns);
          const id = `visx-pattern-demo-${index}-${rowIndex}-${columnIndex}`;

          return (
            <React.Fragment key={id}>
              {/** Like SVG <defs />, Patterns are rendered with an id */}
              <Pattern id={id}
              //prefersReducedMotion={prefersReducedMotion}
               />

              {/** And are then referenced for a style attribute. */}
              <Bar
                fill={`url(#${id})`}
                x={columnIndex * columnWidth}
                y={rowIndex * rowHeight}
                width={columnWidth}
                height={rowHeight}
                rx={14}
              />
            </React.Fragment>
          );
        })}
      </Group>
    </svg>
  ) : null;
}