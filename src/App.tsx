import React, { useEffect, useState } from "react";
import { useCallback } from "react";
import { ICell } from "./components/Cell";
import { Maze } from "./components/Maze";
import "./style.scss";

function App() {
  const [size, setSize] = useState(10);
  const [cells, setCells] = useState<ICell[]>([]);

  const handleSizeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (+e.target.value >= 2) {
        setSize(parseInt(e.target.value));
      }
    },
    []
  );

  const createCells = () => {
    const initialCells: ICell[] = [];

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        initialCells.push({
          x: i,
          y: j,
          visited: false,
          current: false,
          walls: {
            top: true,
            right: true,
            bottom: true,
            left: true,
          },
          size,
        });
      }
    }

    return initialCells;
  };

  const getNeighbors = (cell: ICell) => {
    const neighbors: ICell[] = [];
    const { x, y } = cell;

    if (x === 0 && y === 0) {
      // top left corner
      neighbors.push(cells[cell.x + 1]);
      neighbors.push(cells[cell.y + 1]);
    } else if (x === size - 1 && y === size - 1) {
      // bottom right corner
      neighbors.push(cells[cell.x - 1]);
      neighbors.push(cells[cell.y - 1]);
    } else if (x === 0 && y === size - 1) {
      // top right corner
      neighbors.push(cells[cell.x + 1]);
      neighbors.push(cells[cell.y - 1]);
    } else if (x === size - 1 && y === 0) {
      // bottom left corner
      neighbors.push(cells[cell.x - 1]);
      neighbors.push(cells[cell.y + 1]);
    } else if (x === 0) {
      // top row
      neighbors.push(cells[cell.x + 1]);
      neighbors.push(cells[cell.y - 1]);
      neighbors.push(cells[cell.y + 1]);
    } else if (y === 0) {
      // left column
      neighbors.push(cells[cell.x - 1]);
      neighbors.push(cells[cell.x + 1]);
      neighbors.push(cells[cell.y + 1]);
    } else if (x === size - 1) {
      // right column
      neighbors.push(cells[cell.x - 1]);
      neighbors.push(cells[cell.x + 1]);
      neighbors.push(cells[cell.y - 1]);
    } else if (y === size - 1) {
      // bottom row
      neighbors.push(cells[cell.x - 1]);
      neighbors.push(cells[cell.x + 1]);
      neighbors.push(cells[cell.y - 1]);
    } else {
      // middle cells
      neighbors.push(cells[cell.x - 1]);
      neighbors.push(cells[cell.x + 1]);
      neighbors.push(cells[cell.y - 1]);
      neighbors.push(cells[cell.y + 1]);
    }

    return neighbors;
  };

  useEffect(() => {
    if (!cells.length) {
      setCells(createCells());
      return;
    }

    // Mark all cells as unvisited
    const notVisitedCells = cells.filter((cell) => !cell.visited);

    // Pick a random cell to start with
    const visitedCells: ICell[] = [];

    for (const neighbor of getNeighbors(cells[0])) {
      console.log(neighbor);
    }
  }, [cells, cells.length, createCells, size]);

  return (
    <div className="App">
      <header>
        <label htmlFor="size">Size of the maze</label>
        <input
          type="number"
          min={2}
          name="size"
          onChange={(e) => {
            handleSizeChange(e);
          }}
        />
        <button
          onClick={() => {
            setCells([]);
          }}
        >
          Generate Maze
        </button>
        {cells.length}
      </header>
      <main>
        <Maze size={size} />
      </main>
      <footer>
        Made by{" "}
        <a href="https://github.com/juaniwk3" target="blank">
          Juan IWK3
        </a>
      </footer>
    </div>
  );
}

export default App;
