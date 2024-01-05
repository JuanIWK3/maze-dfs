import type { Cell } from "../types";
import { isAlreadyVisited } from "./isAlreadyVisited";
import { isOutOfBounds } from "./isOutOfBounds";

export function isVisitable(
  x: number,
  y: number,
  size: number,
  visited: Cell[]
) {
  const isVisited = isAlreadyVisited(x, y, visited);
  const isOutOfBound = isOutOfBounds(x, y, size);
  return !isVisited && !isOutOfBound;
}
