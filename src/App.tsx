import React, { useEffect, useState } from "react";
import { useCallback } from "react";
import "./style.scss";

function App() {
  const size = 20;
  const rows = [...Array(size).keys()];
  const columns = [...Array(size).keys()];
  const [current, setCurrent] = useState<[number, number]>([0, 0]);
  const [count, setCount] = useState(0);

  const [visited, setVisited] = useState<Record<string, boolean>>({});
  const [prev, setPrev] = useState<Record<string, string>>({});

  const getColor = (row: number, column: number): string => {
    const color = "black";
    return visited.hasOwnProperty([row, column].toString()) ? color : "white";
  };

  const getDirection = () => {
    return Math.floor(Math.random() * 4);
  };

  const isVisited = useCallback(
    (row: number, column: number) => {
      return visited.hasOwnProperty([row, column].toString());
    },
    [visited]
  );

  useEffect(() => {
    const move = (direction: number) => {
      const moveUp = () => {
        setPrev({
          ...prev,
          [[current[0] - 1, current[1]].toString()]: [current].toString(),
        });
        setCurrent([current[0] - 1, current[1]]);
      };

      const moveDown = () => {
        setPrev({
          ...prev,
          [[current[0] + 1, current[1]].toString()]: [current].toString(),
        });
        setCurrent([current[0] + 1, current[1]]);
      };

      const moveLeft = () => {
        setPrev({
          ...prev,
          [[current[0], current[1] - 1].toString()]: [current].toString(),
        });
        setCurrent([current[0], current[1] - 1]);
      };

      const moveRight = () => {
        setPrev({
          ...prev,
          [[current[0], current[1] + 1].toString()]: [current].toString(),
        });
        setCurrent([current[0], current[1] + 1]);
      };

      if (
        direction === 0 &&
        current[0] !== 0 &&
        !isVisited(current[0] - 1, current[1])
      ) {
        console.log("up");
        moveUp();
        setVisited({ ...visited, [current.toString()]: true });
        return true;
      } else if (
        direction === 1 &&
        current[1] !== size - 1 &&
        !isVisited(current[0], current[1] + 1)
      ) {
        console.log("right");
        moveRight();
        setVisited({ ...visited, [current.toString()]: true });
        return true;
      } else if (
        direction === 2 &&
        current[0] !== size - 1 &&
        !isVisited(current[0] + 1, current[1])
      ) {
        console.log("down");
        moveDown();
        setVisited({ ...visited, [current.toString()]: true });
        return true;
      } else if (
        direction === 3 &&
        current[1] !== 0 &&
        !isVisited(current[0], current[1] - 1)
      ) {
        console.log("left");
        moveLeft();
        setVisited({ ...visited, [current.toString()]: true });
        return true;
      } else {
        return false;
      }
    };
    let conta = 0;

    if (Object.keys(visited).length !== size * size) {
      while (!move(getDirection())) {
        if (conta > 20) {
          if (prev.hasOwnProperty(current.toString())) {
            setVisited({ ...visited, [current.toString()]: true });
            const previous = prev[current.toString()].split(",");
            console.log({ current }, { previous });

            setCurrent([+previous[0], +previous[1]]);
            break;
          } else {
            break;
          }
        } else {
          move(getDirection());
          conta++;
        }
      }
    }
  }, [current, isVisited, prev, visited]);

  return (
    <div className="App">
      {rows.map((row) => (
        <div key={row} className="row">
          {columns.map((column) => (
            <div
              key={column}
              style={{
                backgroundColor: getColor(row, column),
              }}
              className={`cell${
                current[0] === row && current[1] === column ? " current" : ""
              } ${
                visited.hasOwnProperty([row, column].toString())
                  ? " visited"
                  : "notvisited"
              }`}
            >
              {/* {row}:{column} */}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default App;
