<script lang="ts">
  import { store } from "../store.svelte";
  import Chapter from "./chapter.svelte";

  function scrollToChapter(chapterId: string) {
    const element = document.getElementById(chapterId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth", // Smooth animation
        block: "start", // Align element to the top of the viewport
      });
    } else {
      console.warn(`No element found with ID: ${chapterId}`);
    }
  }

  $effect(() => {
    if (store.updatedChapterId) {
      scrollToChapter(store.updatedChapterId);
    }
  });
</script>

<div class="wrapper">
  <div class="list">
    {#each store.chapters as chapter}
      <Chapter {chapter} />
    {/each}
  </div>
</div>

<style>
  .list {
    display: flex;
    flex-direction: column;
    gap: 12px;

    max-height: 366px;
    overflow-y: scroll;
    overflow-x: hidden;

    border-radius: 8px;
  }

  .wrapper {
    padding: 14px 0 0 14px;
  }

  *::-webkit-scrollbar {
    width: 16px;
  }

  *::-webkit-scrollbar-track {
    border-radius: 8px;
  }

  *::-webkit-scrollbar-thumb {
    height: 56px;
    border-radius: 8px;
    border: 4px solid transparent;
    background-clip: content-box;
    background-color: #888;
  }

  *::-webkit-scrollbar-thumb:hover {
    background-color: #555;
  }

  *::-webkit-scrollbar-button:single-button {
    background-color: transparent;
  }

  *::-webkit-scrollbar-button:single-button:hover {
    background-color: transparent;
  }
</style>
