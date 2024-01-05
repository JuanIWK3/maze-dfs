<script lang="ts">
  import { chooseNewPos } from "./lib/chooseNewPos";
  import { isAlreadyVisited } from "./lib/isAlreadyVisited";
  import type { Cell, Position } from "./types";

  let speed = 1;
  let size = 5;
  let pos: Position = { x: 0, y: 0 };
  let visited: Cell[] = [
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
  let directionsTried = new Set<string>();

  function start() {
    move();
  }

  function backTrack() {
    const previousCell = visited.find(
      (cell) => cell.x === pos.x && cell.y === pos.y
    )?.visitedFrom;

    console.log(visited);
    console.log(pos, previousCell);

    if (!previousCell) {
      console.log("no previous visited");
      return;
    }

    pos = {
      x: previousCell.x,
      y: previousCell.y,
    };
  }

  function move() {
    const newPos = chooseNewPos(pos, size, visited);

    while (!newPos) {
      console.log("stuck");
      backTrack();

      return;
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
  }
</script>

<main>
  <div class="">
    <h1 class="title">Maze Generator</h1>
    <div class="flex">
      <label for="size">
        <p>Size</p>
        <input
          class="border px-4 py-2 rounded"
          min="2"
          id="size"
          type="number"
          bind:value={size}
        />
      </label>
      <label for="speed">
        <p>Delay</p>
        <input
          class="border px-4 py-2 rounded"
          min="1"
          id="speed"
          type="number"
          bind:value={speed}
        />
      </label>
      <button class="border px-4 py-2 rounded" on:click={() => start()}
        >Gen</button
      >
    </div>
  </div>

  <div class="maze-container flex w-full justify-center">
    <div class="maze flex flex-col mt-40 border border-blue-900 border-2">
      {#each Array(size) as _, i}
        <div class="row flex items-center justify-center">
          {#each Array(size) as _, j}
            <div
              class="cell w-20 h-20 flex items-center justify-center text-blue-500"
              class:current={pos.x === i && pos.y === j}
              class:visited={visited.some(
                (cell) => cell.x === i && cell.y === j
              )}
            >
              {i}:{j}
            </div>
          {/each}
        </div>
      {/each}
    </div>
  </div>
  <div>{JSON.stringify(visited)}</div>
</main>

<style lang="postcss">
  .current {
    @apply bg-blue-500 text-white;
  }

  .visited {
    @apply bg-blue-200;

    &.current {
      @apply bg-blue-500 text-white;
    }
  }
</style>
