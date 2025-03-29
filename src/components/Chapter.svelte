<script lang="ts">
  import CrossSmall from "./icons/cross-small.svelte";
  import Left from "./icons/left.svelte";
  import Right from "./icons/right.svelte";
  import { getTimestamp } from "../utils";
  import { store } from "../store.svelte";
  import { animate, hover, press } from "motion";
  import { onMount } from "svelte";

  let { chapter } = $props();
  let hovered = $state(false);

  let deleteIcon: HTMLButtonElement;

  let left: HTMLDivElement;
  let right: HTMLDivElement;

  function handleBack() {
    if (chapter.time < 1) return;
    store.seek(chapter.time - 1);
    chapter.time -= 1;

    store.updatedChapterId = chapter.id;
    store.sortChapters();
  }

  function handleForward() {
    store.seek(chapter.time + 1);
    chapter.time += 1;

    store.updatedChapterId = chapter.id;
    store.sortChapters();
  }

  function handleDelete() {
    store.deleteChapter(chapter.id);
  }

  function handleSeek() {
    store.seek(chapter.time);
  }

  function handleMouseEnter() {
    hovered = true;

    store.message =
      chapter.id === "required-chapter" ? "Required chapter at 00:00:00" : null;
  }

  function handleMouseLeave() {
    hovered = false;

    store.message = null;
  }

  onMount(() => {
    hover(deleteIcon, (el) => {
      animate(el, {
        scale: 1.1,
      });

      return () => {
        animate(el, {
          scale: 1,
        });
      };
    });
  });

  $effect(() => {
    if (store.updatedChapterId === chapter.id) {
      document.getElementById(chapter.id)?.focus();

      animate([
        [left, { backgroundColor: "#434343" }],
        [right, { backgroundColor: "#434343" }, { at: "<" }],
        [left, { backgroundColor: "#252525" }, { at: "+0.5" }],
        [right, { backgroundColor: "#252525" }, { at: "<" }],
      ]).then(() => {
        store.updatedChapterId = null;
      });
    }
  });
</script>

<div
  class="chapter"
  role="region"
  onmouseenter={handleMouseEnter}
  onmouseleave={handleMouseLeave}
  class:chapter-hovered={hovered}
>
  <div class="left" bind:this={left}>
    <button
      class="move-left"
      onclick={handleBack}
      class:disabled={chapter.id === "required-chapter"}
    >
      <Left />
    </button>
    <button class="time" onclick={handleSeek}
      >{getTimestamp(chapter.time)}</button
    >
    <button
      class="move-right"
      onclick={handleForward}
      class:disabled={chapter.id === "required-chapter"}
    >
      <Right />
    </button>
  </div>
  <div class="right" bind:this={right}>
    <input type="title" bind:value={chapter.title} id={chapter.id} />
    <button
      class="icon delete"
      onclick={handleDelete}
      bind:this={deleteIcon}
      class:disabled={chapter.id === "required-chapter"}
    >
      <CrossSmall />
    </button>
  </div>
</div>

<style>
  input {
    background: transparent;
    outline: none;
    border: none;
    color: #eeeeee;

    padding: 0;
    height: 42px;
    width: 100%;
  }

  .chapter {
    display: flex;
    flex-direction: row;
    gap: 10px;

    height: 42px;

    color: #eeeeee;
    border-radius: 8px;
  }

  .left {
    display: flex;
    justify-content: space-between;
    align-items: center;

    border-radius: 8px;
    background-color: #252525;

    width: 110px;
    flex-shrink: 0;
  }

  .right {
    display: flex;
    align-items: center;

    border-radius: 8px;
    background-color: #252525;
    padding-left: 14px;

    width: 312px;
  }

  .move-left,
  .move-right {
    display: flex;
    justify-content: center;
    align-items: center;

    background-color: transparent;
    padding-right: 8px;

    color: rgba(255, 255, 255, 0.2);
    opacity: 0;

    &:hover {
      color: rgba(255, 255, 255, 0.8);
    }
  }

  .move-left {
    padding: 13px 0px 13px 3px;
  }

  .move-right {
    padding: 13px 3px 13px 0px;
  }

  .time {
    font-family: "Roboto Mono", monospace !important;
    background: none;
    color: #eeeeee;
    padding: 0;
  }

  .delete {
    display: flex;
    justify-content: center;
    align-items: center;

    height: 32px;
    width: 32px;

    background-color: transparent;
    padding-right: 8px;

    color: rgba(255, 255, 255, 0.2);
    opacity: 0;

    &:hover {
      color: rgba(255, 255, 255, 0.8);
    }
  }

  .chapter-hovered {
    .move-left,
    .move-right,
    .delete {
      opacity: 1;
    }
  }

  .disabled {
    opacity: 0 !important;
    pointer-events: none;
  }
</style>
