import type { Cell } from "../types";

export function isAlreadyVisited(x: number, y: number, visited: Array<Cell>) {
  return visited.some((cell) => cell.x === x && cell.y === y);
}
