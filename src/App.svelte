<script lang="ts">
  let speed = 1;
  let size = 5;
  let pos = { x: 0, y: 0 };
  let visited = new Set();
  let prev = new Map();
  let visitedFrom = new Map();
  let stuck = 0;
  let directionsTried = new Set();

  let getRandomUniqueDirection = () => {
    let direction = Math.floor(Math.random() * 4);

    // If we've tried all directions, backtrack
    if (directionsTried.size === 4) {
      directionsTried.clear();
      stuck = 100;
    }

    // If we've tried this direction before, try again
    while (directionsTried.has(direction)) {
      direction = Math.floor(Math.random() * 4);
    }

    return direction;
  };

  let move = () => {
    const direction = getRandomUniqueDirection();
    // 0 = up, 1 = right, 2 = down, 3 = left

    let next = { x: pos.x, y: pos.y };

    if (
      direction === 0 &&
      pos.x !== 0 &&
      !visited.has(`${pos.x - 1}:${pos.y}`)
    ) {
      console.log("up");
      visitedFrom.set(`${pos.x}:${pos.y}`, direction);
      next.x--;
    } else if (
      direction === 1 &&
      pos.y !== size - 1 &&
      !visited.has(`${pos.x}:${pos.y + 1}`)
    ) {
      console.log("right");
      visitedFrom.set(`${pos.x}:${pos.y}`, direction);
      next.y++;
    } else if (
      direction === 2 &&
      pos.x !== size - 1 &&
      !visited.has(`${pos.x + 1}:${pos.y}`)
    ) {
      console.log("down");
      visitedFrom.set(`${pos.x}:${pos.y}`, direction);
      next.x++;
    } else if (
      direction === 3 &&
      pos.y !== 0 &&
      !visited.has(`${pos.x}:${pos.y - 1}`)
    ) {
      console.log("left");
      visitedFrom.set(`${pos.x}:${pos.y}`, direction);
      next.y--;
    }

    if (visited.has(`${next.x}:${next.y}`)) {
      stuck++;
      directionsTried.add(direction);
      return;
    } else {
      stuck = 0;
      directionsTried.clear();

      visited.add(`${next.x}:${next.y}`);
      prev.set(`${pos.x}:${pos.y}`, direction);
      pos = next;
    }
  };

  const reset = () => {
    visited.clear();
    prev.clear();
    visitedFrom.clear();
    stuck = 0;
    pos = { x: 0, y: 0 };
    visited.add("0:0");
    visitedFrom.set("0:0", "none");
  };

  let start = () => {
    reset();

    const int = setInterval(() => {
      if (visited.size === size * size) {
        console.log("done");
        clearInterval(int);
      }

      move();

      if (visited.size === size * size) {
        console.log("done");
        clearInterval(int);
        pos = { x: 0, y: 0 };
      }

      if (stuck > 10) {
        if (prev.size === 0) {
          console.log("stuck");
          clearInterval(int);
        } else {
          console.log("backtracking");

          const last = Array.from(prev.keys()).pop();
          const lastDirection = prev.get(last);
          prev.delete(last);

          const [x, y] = last.split(":");
          pos = { x: +x, y: +y };

          visitedFrom.set(last, lastDirection);
          stuck = 0;
        }
      }
    }, speed);

    return () => {
      clearInterval(int);
    };
  };

  const getVisitedFrom = (x: number, y: number) => {
    if (visitedFrom.has(`${x}:${y}`)) {
      return `${x} ${y} from-${visitedFrom.get(`${x}:${y}`)}`;
    }
    return "";
  };
</script>

<main>
  <h1 class="title">Maze Generator</h1>

  <div class="options">
    <label for="size">
      <p>Size</p>
      <input
        min="2"
        id="size"
        type="number"
        bind:value={size}
        on:change={reset}
      />
    </label>
    <label for="speed">
      <p>Delay</p>
      <input min="1" id="speed" type="number" bind:value={speed} />
    </label>
    <button on:click={() => start()}>Gen</button>
  </div>

  <div class="maze">
    {#each Array(size) as _, i}
      <div class="row">
        {#each Array(size) as _, j}
          <div
            class="cell {visited.has(`${i}:${j}`) ? 'visited' : ''}
            {pos.x === i && pos.y === j ? 'current' : ''}
            {getVisitedFrom(i, j)}
            {i === 0 ? 'border-top' : ''}
            {j === 0 ? 'border-left' : ''}
            {i === size - 1 ? 'border-bottom' : ''}
            {j === size - 1 ? 'border-right' : ''}
            "
          >
            {i}:{j}
          </div>
        {/each}
      </div>
    {/each}
  </div>
</main>

<style lang="scss">
  $accent: rgb(88, 141, 255);

  .options {
    padding: 1em;
    display: flex;
    align-items: end;
    justify-content: center;
    gap: 1em;

    input {
      width: 6em;
    }
  }

  .maze {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px solid $accent;
    user-select: none;
    width: 100%;
    height: 90%;
    overflow: hidden;
    aspect-ratio: 1/1;
    max-height: 70vh;
    max-width: 70vh;

    .row {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;

      width: 100%;
      height: 100%;

      .cell {
        display: flex;
        align-items: center;
        justify-content: center;
        color: #444;
        transition: background-color 0.2s ease-in-out;
        width: 100%;
        height: 100%;
        font-size: small;
        margin: -1px;

        &.from-0 {
          border-right: 1px solid black;
          border-left: 1px solid black;
        }
        &.from-1 {
          border-top: 1px solid black;
          border-bottom: 1px solid black;
        }
        &.from-2 {
          border-right: 1px solid black;
          border-left: 1px solid black;
        }
        &.from-3 {
          border-top: 1px solid black;
          border-bottom: 1px solid black;
        }

        &.border-left {
          border-left: none;
        }
        &.border-right {
          border-right: none;
        }
        &.border-top {
          border-top: none;
        }
        &.border-bottom {
          border-bottom: none;
        }

        &.visited {
          color: $accent;
          background: #333;
        }

        &.current {
          background-color: $accent;
          color: #fff;
        }
      }
    }
  }
</style>
