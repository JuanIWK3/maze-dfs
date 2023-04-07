<script lang="ts">
  let speed = 1;
  let size = 10;
  let pos = { x: 0, y: 0 };
  let visited = new Set();
  let prev = new Map();
  let visitedFrom = new Map();
  let stuck = 0;
  let prevDirection = 0;

  let getRandomUniqueDirection = () => {
    let direction = Math.floor(Math.random() * 4);

    if (direction === prevDirection) {
      direction = (direction + 1) % 4;
    }

    prevDirection = direction;

    return direction;
  };

  let move = () => {
    const direction = getRandomUniqueDirection();
    let next = { x: pos.x, y: pos.y };

    const moveUp = () => {
      prev.set(`${next.x}:${next.y}`, "2");
    };

    const moveDown = () => {
      prev.set(`${next.x}:${next.y}`, "0");
    };

    const moveLeft = () => {
      prev.set(`${next.x}:${next.y}`, "1");
    };

    const moveRight = () => {
      prev.set(`${next.x}:${next.y}`, "3");
    };

    if (
      direction === 0 &&
      pos.x !== 0 &&
      !visitedFrom.has(`${pos.x - 1}:${pos.y}`)
    ) {
      next.x--;
      moveUp();
    } else if (
      direction === 1 &&
      pos.y !== 0 &&
      !visitedFrom.has(`${pos.x}:${pos.y - 1}`)
    ) {
      next.y--;
      moveLeft();
    } else if (
      direction === 2 &&
      pos.x !== size - 1 &&
      !visitedFrom.has(`${pos.x + 1}:${pos.y}`)
    ) {
      next.x++;
      moveDown();
    } else if (
      direction === 3 &&
      pos.y !== size - 1 &&
      !visitedFrom.has(`${pos.x}:${pos.y + 1}`)
    ) {
      next.y++;
      moveRight();
    }

    if (visited.has(`${next.x}:${next.y}`)) {
      stuck++;
    } else {
      visited.add(`${next.x}:${next.y}`);
      visitedFrom.set(`${next.x}:${next.y}`, direction);
      pos = next;
      stuck = 0;
    }
  };

  let start = () => {
    visited.clear();
    prev.clear();
    visitedFrom.clear();
    stuck = 0;
    pos = { x: 0, y: 0 };
    visited.add("0:0");

    const int = setInterval(() => {
      if (visited.size === size * size) {
        console.log("done");
        clearInterval(int);
      }

      move();

      if (visited.size === size * size) {
        console.log("done");
        clearInterval(int);
      }

      if (stuck > 4) {
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
    return visitedFrom.get(`${x}:${y}`);
  };

  const reset = () => {
    visited.clear();
    prev.clear();
    visitedFrom.clear();
    stuck = 0;
    pos = { x: 0, y: 0 };
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
            {pos.x === i && pos.y === j ? 'current' : ''}"
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
    height: 100%;
    overflow: hidden;
    aspect-ratio: 1/1;

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
