<script lang="ts">
  import { animate, hover, press } from "motion";
  import ForwardIcon from "./icons/forward.svelte";
  import RewindIcon from "./icons/rewind.svelte";
  import Add from "./add.svelte";
  import { store } from "../store.svelte";

  let rewindButton: HTMLButtonElement;
  let forwardButton: HTMLButtonElement;

  let rewindHover = $state(false);
  let forwardHover = $state(false);

  function handleRewind() {
    store.rewind();
  }

  function handleForward() {
    store.forward();
  }

  $effect(() => {
    hover(rewindButton, (button) => {
      animate(button, { scale: 1.1 });

      return () => {
        animate(button, { scale: 1 });
      };
    });

    hover(forwardButton, (button) => {
      animate(button, { scale: 1.1 });

      return () => {
        animate(button, { scale: 1 });
      };
    });

    press(rewindButton, (button) => {
      animate(button, { scale: 0.8 });

      return () => {
        animate(button, { scale: rewindHover ? 1.1 : 1 });
      };
    });

    press(forwardButton, (button) => {
      animate(button, { scale: 0.8 });

      return () => {
        animate(button, { scale: forwardHover ? 1.1 : 1 });
      };
    });
  });
</script>

<div class="container">
  <button
    class="rewind"
    bind:this={rewindButton}
    onclick={handleRewind}
    onmouseenter={() => (rewindHover = true)}
    onmouseleave={() => (rewindHover = false)}
  >
    <RewindIcon />
  </button>
  <Add />
  <button
    class="forward"
    bind:this={forwardButton}
    onclick={handleForward}
    onmouseenter={() => (forwardHover = true)}
    onmouseleave={() => (forwardHover = false)}
  >
    <ForwardIcon />
  </button>
</div>

<style>
  .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
  }

  .rewind,
  .forward {
    width: 36px;
    height: 36px;
    border-radius: 50%;

    background-color: #3b3b3b;

    border: none;
    outline: none;
    cursor: pointer;

    transform-origin: center;
  }

  button {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
