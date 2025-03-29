<script lang="ts">
  import { store } from "../store.svelte";
  import Chapter from "./Chapter.svelte";

  let list: HTMLDivElement;

  function scrollToChapter(chapterId: string) {
    // Get the scrollable container
    const container = list;

    // Get the chapter element
    const chapterElement = document.getElementById(chapterId);
    if (!chapterElement) {
      console.error(`Chapter with id "${chapterId}" not found.`);
      return;
    }

    // Calculate the chapter's position relative to the container
    const chapterTop = chapterElement.offsetTop;
    const chapterBottom = chapterTop + chapterElement.offsetHeight;
    const containerScrollTop = container.scrollTop;
    const containerHeight = container.clientHeight;

    // Check if the chapter is fully visible within the container
    const isFullyVisible =
      chapterTop >= containerScrollTop &&
      chapterBottom <= containerScrollTop + containerHeight;

    // Scroll only if the chapter is not fully in view
    if (!isFullyVisible) {
      container.scrollTo({
        top: chapterTop,
        behavior: "smooth",
      });
    }
  }

  $effect(() => {
    if (store.updatedChapterId) {
      scrollToChapter(store.updatedChapterId);
    }
  });
</script>

<div class="wrapper">
  <div class="list" bind:this={list}>
    {#each store.chapters as chapter}
      <Chapter {chapter} />
    {/each}
  </div>
</div>

<style>
  .wrapper {
    margin: 14px 0 0 14px;
  }

  .list {
    display: flex;
    flex-direction: column;
    gap: 12px;

    max-height: 366px;
    overflow-y: scroll;
    overflow-x: hidden;
  }
</style>
