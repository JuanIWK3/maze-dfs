import type { Cell, Position } from "../types";
import { isVisitable } from "./isVisitable";

function choose(
  pos: Position,
  size: number,
  visited: Cell[],
  directionsTried: Set<string>
) {
  const directions = {
    up: { x: -1, y: 0 },
    down: { x: 1, y: 0 },
    left: { x: 0, y: -1 },
    right: { x: 0, y: 1 },
  };

  const directionsToTry = Object.keys(directions).filter(
    (direction) => !directionsTried.has(direction)
  );

  if (directionsToTry.length === 0) {
    return null;
  }

  const direction = directionsToTry[
    Math.floor(Math.random() * directionsToTry.length)
  ] as keyof typeof directions;

  const { x, y } = directions[direction];

  if (isVisitable(pos.x + x, pos.y + y, size, visited)) {
    return directions[direction];
  } else {
    directionsTried.add(direction);
    return choose(pos, size, visited, directionsTried);
  }
}

export function chooseNewPos(
  pos: Position,
  size: number,
  visited: Cell[]
): Position | null {
  const directionsTried = new Set<string>();

  const direction = choose(pos, size, visited, directionsTried);

  if (direction === null) {
    return null;
  } else {
    const { x, y } = direction;

    return { x: pos.x + x, y: pos.y + y };
  }
}
