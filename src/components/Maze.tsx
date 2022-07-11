import React, { useState } from "react";
import { Cell } from "./Cell";

export const Maze = ({ size }: { size: number }) => {
  const rows = Array.from(Array(size).keys());
  const cols = Array.from(Array(size).keys());
  const [currentCell, setCurrentCell] = useState<[number, number]>([0, 0]);

  return (
    <div>
      {rows.map((row, i) => (
        <div className="row" key={row}>
          {cols.map((col, j) => (
            <Cell
              key={col}
              x={i}
              y={j}
              current={currentCell[0] === i && currentCell[1] === j}
              visited={false}
              walls={{
                top: true,
                right: true,
                bottom: true,
                left: true,
              }}
              size={size}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
