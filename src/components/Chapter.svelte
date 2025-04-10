<script lang="ts">
  import { getTimestamp } from "../utils";
  import DeleteIcon from "./icons/delete.svelte";
  import MoveLeftIcon from "./icons/move-left.svelte";
  import MoveRightIcon from "./icons/move-right.svelte";
  import { animate } from "motion";
  import { store } from "../store.svelte";

  let { chapter } = $props();
  let hovered = $state(false);

  let removeEl: HTMLButtonElement;

  let leftEl: HTMLDivElement;
  let rightEl: HTMLDivElement;

  function handleMouseEnter() {
    hovered = true;

    store.message =
      chapter.id === "required-chapter" ? "Required chapter at 00:00:00" : null;
  }

  function handleMouseLeave() {
    hovered = false;

    store.message = null;
  }

  function handleRemove() {
    store.removeChapter(chapter.id);
  }

  function handleBack() {
    if (chapter.timestamp < 1) return;
    store.seek(chapter.timestamp - 1);
    chapter.timestamp -= 1;

    store.updatedChapterId = chapter.id;
    store.sortChapters();
  }

  function handleForward() {
    store.seek(chapter.timestamp + 1);
    chapter.timestamp += 1;

    store.updatedChapterId = chapter.id;
    store.sortChapters();
  }

  function handleSeek() {
    store.seek(chapter.timestamp);
  }

  $effect(() => {
    if (store.updatedChapterId === chapter.id) {
      document.getElementById(chapter.id)?.focus();

      animate([
        [leftEl, { backgroundColor: "#343434", borderColor: "#4C4C4C" }],
        [
          rightEl,
          { backgroundColor: "#343434", borderColor: "#4C4C4C" },
          { at: "<" },
        ],
        [
          leftEl,
          { backgroundColor: "#252525", borderColor: "#252525" },
          { at: "+0.5" },
        ],
        [
          rightEl,
          { backgroundColor: "#252525", borderColor: "#252525" },
          { at: "<" },
        ],
      ]).then(() => {
        store.updatedChapterId = null;
      });
    }
  });
</script>

<div
  id={chapter.id}
  class="container chapter"
  role="region"
  onmouseenter={handleMouseEnter}
  onmouseleave={handleMouseLeave}
  class:chapter-hovered={hovered && chapter.id !== "required-chapter"}
  class:disabled={chapter.id === "required-chapter"}
>
  <div class="left" bind:this={leftEl}>
    <button class="move-left" onclick={handleBack}>
      <MoveLeftIcon />
    </button>
    <button class="timestamp" onclick={handleSeek}
      >{getTimestamp(chapter.timestamp)}</button
    >
    <button class="move-right" onclick={handleForward}>
      <MoveRightIcon />
    </button>
  </div>
  <div class="right" bind:this={rightEl}>
    <input class="title" type="text" bind:value={chapter.title} />
    <button class="remove" bind:this={removeEl} onclick={handleRemove}>
      <DeleteIcon />
    </button>
  </div>
</div>

<style>
  .container {
    height: 42px;
    border-radius: 8px;
    flex-shrink: 0;

    display: flex;
    gap: 10px;

    overflow: hidden;
  }

  .left {
    width: 110px;
    border-radius: 8px;
    background-color: #252525;

    display: flex;
    justify-content: center;
    align-items: center;

    position: relative;

    border: 1px solid #252525;
  }

  .right {
    width: 312px;
    border-radius: 8px;
    background-color: #252525;

    display: flex;
    align-items: center;

    position: relative;

    border: 1px solid #252525;
  }

  .timestamp {
    font-family: "Roboto Mono", monospace !important;
    font-size: 14px;
    color: #eeeeee;

    user-select: none;
  }

  .move-left,
  .move-right {
    position: absolute;
    width: 14px;
    height: 100%;
    color: #414141;
    padding: 0;

    &:hover {
      color: #bbbbbb;
    }
  }

  .move-left {
    left: 2px;
  }

  .move-right {
    right: 2px;
  }

  .title {
    color: #eeeeee;
    background-color: transparent;
    outline: none;
    border: none;
    padding-left: 14px;
    padding-right: 14px;
    width: 100%;
  }

  .chapter-hovered {
    .title {
      width: 286px !important;
    }
  }

  .remove {
    position: absolute;
    top: 0px;
    right: 0px;

    height: 42px;
    border-radius: 8px;

    color: #525252;

    padding: 11px 11px 11px 12px;

    &:hover {
      color: #bbbbbb;
    }
  }

  .move-left,
  .move-right,
  .remove {
    opacity: 0;
  }

  .chapter-hovered {
    .move-left,
    .move-right,
    .remove {
      opacity: 1;
    }
  }

  button {
    background-color: transparent;
    outline: none;
    border: none;

    cursor: pointer;
  }

  .disabled {
    .move-left,
    .move-right,
    .remove {
      opacity: 0 !important;
      pointer-events: none;
    }
  }
</style>
