<script lang="ts">
  import { chooseNewPos } from "./lib/chooseNewPos";
  import type { Cell, Position } from "./types";

  let speed = 100;
  let size = 5;
  let pos: Position = { x: 0, y: 0 };
  let visited: Cell[] = [
    {
      x: 0,
      y: 0,
      visited: true,
      visitedFrom: null,
    },
  ];
  let directionsTried = new Set<string>();
  let stop = false;

  function reset() {
    pos = { x: 0, y: 0 };
    visited = [
      {
        x: 0,
        y: 0,
        visited: true,
        visitedFrom: {
          x: 0,
          y: 0,
        },
      },
    ];
    directionsTried = new Set<string>();
    stop = false;
  }

  function start() {
    reset();
    move();
  }

  $: cellSize = `w-${100 / size} h-${100 / size}`;

  // if not awaited it will teleport the current pos to the new pos backtracked
  async function backTrack() {
    return new Promise((resolve, reject) => {
      const previousCell = visited.find(
        (cell) => cell.x === pos.x && cell.y === pos.y
      )?.visitedFrom;

      if (!previousCell) {
        stop = true;

        setTimeout(() => {
          reject("no previous cell visited");
        }, speed);
      }

      pos = {
        x: previousCell.x,
        y: previousCell.y,
      };

      setTimeout(() => {
        resolve("done");
      }, speed);
    });
  }

  async function move() {
    if (stop) {
      return;
    }

    const newPos = chooseNewPos(pos, size, visited);

    while (!newPos) {
      await backTrack();

      return move();
    }

    visited = [
      ...visited,
      {
        x: newPos.x,
        y: newPos.y,
        visited: true,
        visitedFrom: {
          x: pos.x,
          y: pos.y,
        },
      },
    ];

    pos = newPos;

    if (visited.length === size * size) {
      console.log("finished");
    }

    setTimeout(() => {
      move();
    }, speed);
  }

  function visitedFromDirection(cell: Cell | undefined) {
    if (!cell) {
      return "";
    }
    if (cell.visitedFrom) {
      if (cell.visitedFrom.x === cell.x) {
        if (cell.visitedFrom.y > cell.y) {
          return "right";
        } else {
          return "left";
        }
      } else {
        if (cell.visitedFrom.x > cell.x) {
          return "bottom";
        } else {
          return "top";
        }
      }
    }
  }
</script>

<main>
  <div class="flex flex-col w-full items-center mt-8">
    <h1 class="text-3xl font-bold text-blue-600">Maze Generator</h1>
    <div class="flex gap-2 items-end mt-8">
      <label for="size">
        <p class="mb-2 ml-1">Size (n x n)</p>
        <input
          class="border px-4 py-2 rounded"
          min="2"
          max="200"
          id="size"
          type="number"
          bind:value={size}
        />
      </label>
      <label class="" for="speed">
        <p class="mb-2 ml-1">Delay (ms)</p>
        <input
          class="border px-4 py-2 rounded"
          min="0"
          id="speed"
          type="number"
          step="100"
          bind:value={speed}
        />
      </label>
      <button
        class="border px-4 py-2 rounded bg-blue-600 text-white"
        on:click={() => start()}>Gen</button
      >
    </div>
  </div>

  <div class="flex w-full h-[70vh] justify-center items-center">
    <div
      class="h-full bg-white-100 aspect-square maze flex flex-col mt-40 m-16 border-blue-900 border-4"
    >
      {#each Array(size) as _, i (i)}
        <div class="row flex items-center justify-center">
          {#each Array(size) as _, j (j)}
            <div
              class="{visitedFromDirection(
                visited.find((cell) => cell.x === i && cell.y === j)
              )}                                        
              cell w-full h-full aspect-square flex items-center justify-center text-blue-500 transition-all transition-200"
              class:current={pos.x === i && pos.y === j}
              class:visited={visited.some(
                (cell) => cell.x === i && cell.y === j
              )}
            >
              <!-- {i}:{j} -->
            </div>
          {/each}
        </div>
      {/each}
    </div>
  </div>
</main>

<style lang="postcss">
  .current {
    background-color: #2563eb !important;
    margin: 16px;
  }

  .cell {
    margin: 0px;
    border-right: 1px solid black;
    border-bottom: 1px solid black;
  }

  .visited {
  }

  .top {
    border-bottom: 1px solid #fff;
  }
  .bottom {
    border-bottom: 1px solid #fff;
  }
  .left {
    border-right: 1px solid #fff;
  }
  .right {
    border-right: 1px solid #fff;
  }
</style>
