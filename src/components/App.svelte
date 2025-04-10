<script lang="ts">
  import { onMount } from "svelte";
  import Controls from "../components/controls.svelte";
  import List from "../components/list.svelte";
  import Menu from "../components/menu.svelte";
  import Note from "../components/note.svelte";
  import { store } from "../store.svelte";
  import { animate } from "motion";

  let overlayEl: HTMLDivElement;

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

  $effect(() => {
    if (store.ambience) {
      animate(overlayEl, { height: "100%" });
    } else {
      animate(overlayEl, { height: "0%" });
    }
  });

  $inspect(store.chapters);
</script>

<div id="chapters-please">
  <div id="overlay" bind:this={overlayEl}></div>
  <div id="app" style="right: {store.right}px; bottom: {store.bottom}px;">
    <Menu />
    <div class="main">
      <List />
      <Note />
      <Controls />
    </div>
  </div>
</div>

<style>
  #overlay {
    inset: 0;
    position: fixed;
    background-color: rgba(0, 0, 0);
    opacity: 0.7;
    height: 0%;

    pointer-events: none;
  }

  #app {
    position: fixed;
  }

  .main {
    width: 460px;
    background-color: #151515;

    border-radius: 16px 16px 42px 42px;
  }

  :global(body) {
    background-color: #101010;
    color: #eeeeee;
    font-family: "Inter", sans-serif;
    font-size: 14px;

    display: flex;
    justify-content: center;
    align-items: center;

    height: 100vh;
  }

  ::selection {
    color: #eeeeee;
    background: #3a3a3a;
  }

  #chapters-please {
    position: relative;
    z-index: 99999;
  }
</style>
