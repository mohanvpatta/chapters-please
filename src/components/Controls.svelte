<script lang="ts">
  import { store } from "../store.svelte";
  import { didStateChangeAfterClear, getTimestamp } from "../utils";
  import Check from "./icons/check.svelte";
  import Copy from "./icons/copy.svelte";
  import Clear from "./icons/clear.svelte";
  import Undo from "./icons/undo.svelte";
  import Playback from "./Playback.svelte";
  import { animate, press } from "motion";
  import { onMount } from "svelte";

  let copyIcon: HTMLDivElement;
  let tickIcon: HTMLDivElement;
  let copyTickButton: HTMLButtonElement;
  let clearUndoButton: HTMLButtonElement;
  let clearIcon: HTMLDivElement;
  let undoIcon: HTMLDivElement;

  let stateChangedAfterClear = $state(false);
  let clickedClear = false;

  function handleCopyToClipboard() {
    const formattedChapters = store.chapters
      .map(({ time, title }) => `${getTimestamp(time)} ${title}`)
      .join("\n");
    navigator.clipboard
      .writeText(formattedChapters)
      .then(() => {
        animate([
          [copyIcon, { opacity: 0, scale: 0 }],
          [tickIcon, { opacity: 1, scale: 1 }, { at: "<" }],
          [tickIcon, { opacity: 0, scale: 0 }, { delay: 1 }],
          [copyIcon, { opacity: 1, scale: 1 }, { at: "<", delay: 1.2 }],
        ]);
      })
      .catch((error) => console.error("Failed to copy chapters:", error));
  }

  function handleClearUndo() {
    if (clickedClear && !stateChangedAfterClear) {
      // restoring the chapters
      store.retrieveChapters();
      clickedClear = false;

      animate([
        [undoIcon, { opacity: 0, scale: 0 }],
        [clearIcon, { opacity: 1, scale: 1 }, { at: "<" }],
      ]);
    } else {
      // clearing the chapters
      store.clearChapters();
      clickedClear = true;

      animate([
        [clearIcon, { opacity: 0, scale: 0 }],
        [undoIcon, { opacity: 1, scale: 1 }, { at: "<" }],
      ]);
    }
  }

  onMount(() => {
    press(copyTickButton, (el) => {
      animate(el, {
        scale: 0.9,
      });

      return () => {
        animate(el, {
          scale: 1,
        });
      };
    });

    press(clearUndoButton, (el) => {
      animate(el, {
        scale: 0.8,
      });

      return () => {
        animate(el, {
          scale: 1,
        });
      };
    });
  });

  $effect(() => {
    if (stateChangedAfterClear) {
      animate([
        [undoIcon, { opacity: 0, scale: 0 }],
        [clearIcon, { opacity: 1, scale: 1 }, { at: "<" }],
      ]);
    }
  });

  $effect(() => {
    if (didStateChangeAfterClear(store.chapters)) {
      stateChangedAfterClear = true;
    } else {
      stateChangedAfterClear = false;
    }
  });
</script>

<div class="controls">
  <button
    class="copy-tick icon"
    bind:this={copyTickButton}
    onclick={handleCopyToClipboard}
    onmouseenter={() => (store.message = "Copy chapters to clipboard")}
    onmouseleave={() => (store.message = null)}
  >
    <div class="wrapper" bind:this={copyIcon}>
      <Copy />
    </div>
    <div class="wrapper" bind:this={tickIcon} style="opacity: 0">
      <Check />
    </div>
  </button>

  <Playback />
  <button
    class="clear-undo icon"
    bind:this={clearUndoButton}
    onclick={handleClearUndo}
    onmouseenter={() =>
      (store.message =
        clickedClear && !stateChangedAfterClear
          ? "Restore chapters"
          : "Clear chapters")}
    onmouseleave={() => (store.message = null)}
  >
    <div class="wrapper" bind:this={clearIcon}>
      <Clear />
    </div>
    <div class="wrapper" bind:this={undoIcon} style="opacity: 0">
      <Undo />
    </div>
  </button>
</div>

<style>
  .controls {
    margin: 40px 22px 22px;

    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .wrapper {
    width: 20px;
    height: 20px;

    position: absolute;
    color: #bbbbbb;
  }

  .icon {
    height: 36px;
    width: 36px;

    border-radius: 50px;
    color: #bbbbbb;
    background-color: #252525;

    display: flex;
    justify-content: center;
    align-items: center;
  }

  .clear-undo {
    position: relative;

    overflow: hidden;
  }
</style>
