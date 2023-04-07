<script lang="ts">
  let size = 6;
  let pos = { x: 0, y: 0 };
  let visited = new Set();
  let prev = new Map();
  let visitedFrom = new Map();
  let stuck = 0;

  let getDirection = () => {
    return Math.floor(Math.random() * 4);
  };

  let start = setInterval(() => {
    move();
    // console.log(visitedFrom);

    if (visited.size === size * size) {
      console.log("done");
      clearInterval(start);
    }

    if (stuck > 50) {
      console.log("stuck");
      clearInterval(start);
    }
  }, 10);

  let move = () => {
    let direction = getDirection();
    let next = { x: pos.x, y: pos.y };

    switch (direction) {
      case 0:
        next.x++;
        break;
      case 1:
        next.x--;
        break;
      case 2:
        next.y++;
        break;
      case 3:
        next.y--;
        break;
    }

    if (next.x < 0 || next.x >= size || next.y < 0 || next.y >= size) {
      return;
    }

    if (visited.has(`${next.x}:${next.y}`)) {
      stuck++;
      return;
    }

    visited.add(`${pos.x}:${pos.y}`);

    visitedFrom.set(`${next.x}:${next.y}`, `${direction}`);

    prev.set(`${next.x}:${next.y}`, `${pos.x}:${pos.y}`);

    pos = next;
  };

  const getVisitedFrom = (x: number, y: number) => {
    return visitedFrom.get(`${x}:${y}`);
  };
</script>

<main>
  <label for="size">
    <p>Size</p>
    <input min="2" id="size" type="number" bind:value={size} />
  </label>

  <div class="maze">
    {#each Array(size) as _, i}
      <div class="row">
        {#each Array(size) as _, j}
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <div
            class="cell
              {i === 0 ? 'border-left' : ''}
              {i === size - 1 ? 'border-bottom' : ''}
              {j === 0 ? 'border-left' : ''}
              {j === size - 1 ? 'border-right' : ''}
              {visited.has(`${i}:${j}`) ? 'visited' : ''}"
            style={`
              background-color: ${
                i === pos.x && j === pos.y ? "rgb(88, 141, 255)" : ""
              };
              color: ${visited.has(`${i}:${j}`) ? "#666" : "#333"};
              ${
                getVisitedFrom(i, j) === "0"
                  ? "border-right: 1px solid white;border-left: 1px solid white;"
                  : ""
              }
              ${
                getVisitedFrom(i, j) === "1"
                  ? "border-top: 1px solid white;border-bottom: 1px solid white;"
                  : ""
              }
              ${
                getVisitedFrom(i, j) === "2"
                  ? "border-right: 1px solid white;border-left: 1px solid white;"
                  : ""
              }
              ${
                getVisitedFrom(i, j) === "3"
                  ? "border-top: 1px solid white;border-bottom: 1px solid white;"
                  : ""
              }
             
            `}
            on:click={() => {
              pos = { x: i, y: j };
            }}
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

  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .maze {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px solid $accent;
    user-select: none;

    .row {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;

      .cell {
        width: 3rem;
        height: 3rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #444;
        transition: background-color 0.2s ease-in-out;

        &.from-0 {
          border-right: 1px solid red;
          border-left: 1px solid red;
        }
        &.from-1 {
          border-top: 1px solid red;
          border-bottom: 1px solid red;
        }
        &.from-2 {
          border-right: 1px solid red;
          border-left: 1px solid red;
        }
        &.from-3 {
          border-top: 1px solid red;
          border-bottom: 1px solid red;
        }

        &.border-left {
          border-left: none !important;
        }
        &.border-right {
          border-right: none !important;
        }
        &.border-top {
          border-top: none !important;
        }
        &.border-bottom {
          border-bottom: none !important;
        }
      }
    }
  }

  label {
    display: flex;
    align-items: center;
    width: max-content;
    margin-bottom: 2rem;
    gap: 1rem;

    input {
      padding: 0.6rem;
      border-radius: 5px;
      border: none;

      color: $accent;
    }
  }
</style>
