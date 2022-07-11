import React from "react";

export interface ICell {
  x: number;
  y: number;
  visited: boolean;
  current: boolean;
  walls: {
    top: boolean;
    right: boolean;
    bottom: boolean;
    left: boolean;
  };
  size: number;
}

export const Cell = ({ x, y, visited, current, walls, size }: ICell) => {
  return (
    <div
      className={`cell ${
        x === 0 && y === 0
          ? "start"
          : x === size - 1 && y === size - 1
          ? "end"
          : ""
      }
        ${current ? "current" : visited ? "visited" : ""}
        ${walls.top ? "top" : ""}
        ${walls.right ? "right" : ""}
        ${walls.bottom ? "bottom" : ""}
        ${walls.left ? "left" : ""}
      `}
      onClick={() => {
        console.log({
          x,
          y,
          visited,
          current,
          walls,
          size,
        });
      }}
    >
      {x}:{y}
    </div>
  );
};
