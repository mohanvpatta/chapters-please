<script lang="ts">
  import { onMount } from "svelte";
  import { store } from "../store.svelte";
  import Controls from "./Controls.svelte";
  import List from "./List.svelte";
  import Toolbar from "./Toolbar.svelte";

  onMount(() => {
    store.video = document.querySelector("video");

    if (!store.video) return;

    store.isPlaying = !store.video.paused;

    const handlePlayPause = () => {
      if (store.video) {
        store.isPlaying = !store.video.paused;
      }
    };

    const handleTimeUpdate = () => {
      if (store.video) {
        store.current = store.video.currentTime;
      }
    };

    store.video.addEventListener("timeupdate", handleTimeUpdate);
    store.video.addEventListener("play", handlePlayPause);
    store.video.addEventListener("pause", handlePlayPause);

    return () => {
      if (store.video) {
        store.video.removeEventListener("timeupdate", handleTimeUpdate);
        store.video.removeEventListener("play", handlePlayPause);
        store.video.removeEventListener("pause", handlePlayPause);
      }
    };
  });

  $effect(() => {
    localStorage.setItem("chapters-please", JSON.stringify(store.chapters));
  });
</script>

<div id="chapters-please">
  <div id="overlay" class:enabled={store.ambience}></div>
  <div id="app" style="right: {store.x}px; bottom: {store.y}px; ">
    <Toolbar />
    <div class="main">
      <List />
      <div class="caption">
        {#if store.message}
          {store.message}
        {:else}
          {store.chapters.length} chapters are sorted and saved!
        {/if}
      </div>
      <Controls />
    </div>
  </div>
</div>

<style>
  #overlay {
    inset: 0;
    position: fixed;
    background-color: rgba(0, 0, 0);
    opacity: 0;

    pointer-events: none;
  }

  .enabled {
    opacity: 0.7 !important;
  }

  #app {
    background-color: #151515;
    border-radius: 16px;

    width: 460px;

    position: fixed;
    /* bottom: 80px;
    right: 20px; */

    z-index: 999999;
  }

  .main {
    z-index: 10;
    position: relative;
  }

  .caption {
    color: #666666;
    width: fit-content;

    margin: 16px auto 4px auto;
  }

  #chapters-please {
    position: relative;
    z-index: 99999;
  }
</style>
