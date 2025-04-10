<script lang="ts">
  import { animate, hover, press } from "motion";
  import ClearIcon from "./icons/clear.svelte";
  import UndoIcon from "./icons/undo.svelte";
  import { store } from "../store.svelte";
  import { didStateChangeAfterClear } from "../utils";

  let buttonHover = $state(false);

  let clearButton: HTMLButtonElement;
  let clearIcon: HTMLDivElement;
  let undoIcon: HTMLDivElement;

  let stateChangedAfterClear = $state(false);
  let clickedClear = $state(false);

  function handleClearUndo() {
    if (clickedClear && !stateChangedAfterClear) {
      // restoring the chapters
      store.retrieveChapters();
      clickedClear = false;

      animate(clearIcon, { opacity: 1, rotate: 0 });
      animate(undoIcon, { opacity: 0, rotate: -90 });
    } else {
      // clearing the chapters
      store.clearChapters();
      clickedClear = true;

      animate(clearIcon, { opacity: 0, rotate: -90 });
      animate(undoIcon, { opacity: 1, rotate: 0 });
    }
  }

  $effect(() => {
    hover(clearButton, (button) => {
      animate(button, { scale: 1.1, rotate: -5 });

      return () => {
        animate(button, { scale: 1, rotate: 0 });
      };
    });

    press(clearButton, (button) => {
      animate(button, { scale: 0.9, rotate: -20 });

      return () => {
        animate(button, {
          scale: buttonHover ? 1.1 : 1,
          rotate: buttonHover ? -5 : 0,
        });
      };
    });
  });

  $effect(() => {
    if (buttonHover) {
      store.message =
        clickedClear && !stateChangedAfterClear
          ? "Restore chapters"
          : "Clear chapters";
    } else {
      store.message = null;
    }
  });

  $effect(() => {
    if (didStateChangeAfterClear(store.chapters)) {
      stateChangedAfterClear = true;
    } else {
      stateChangedAfterClear = false;
    }
  });

  $effect(() => {
    if (stateChangedAfterClear) {
      animate(clearIcon, { opacity: 1, rotate: 0 });
      animate(undoIcon, { opacity: 0, rotate: -90 });
    }
  });
</script>

<button
  id="clear-button"
  bind:this={clearButton}
  onclick={handleClearUndo}
  onmouseenter={() => (buttonHover = true)}
  onmouseleave={() => (buttonHover = false)}
>
  <div id="clear-icon" class="icon" bind:this={clearIcon}>
    <ClearIcon />
  </div>
  <div id="undo-icon" class="icon" bind:this={undoIcon} style:opacity="0">
    <UndoIcon />
  </div>
</button>

<style>
  #clear-button {
    width: 36px;
    height: 36px;
    background-color: #252525;

    border-radius: 30px;

    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  .icon {
    position: absolute;
    width: 20px;
    height: 20px;
  }

  button {
    outline: none;
    border: none;
    cursor: pointer;

    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
