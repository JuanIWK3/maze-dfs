export type Position = {
  x: number;
  y: number;
};

export type Cell = {
  x: number;
  y: number;
  visited: boolean;
  visitedFrom: Position | null;
};
