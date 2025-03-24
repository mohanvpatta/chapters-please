<script lang="ts">
  import Add from "./icons/add.svelte";
  import Bg from "./icons/bg.svelte";
  import Play from "./icons/play.svelte";
  import { store } from "../store.svelte";
  import Pause from "./icons/pause.svelte";
  import { animate, press } from "motion";
  import { onMount } from "svelte";

  let playPauseIcon: HTMLButtonElement;
  let addIcon: HTMLButtonElement;
  let playIcon: HTMLDivElement;
  let pauseIcon: HTMLDivElement;

  function handleToggle() {
    store.togglePlay();
  }

  function handleAddChapter() {
    store.addChapter();
  }

  $effect(() => {
    animate(playIcon, {
      opacity: store.isPlaying ? 0 : 1,
      scale: store.isPlaying ? 0 : 1,
    });
    animate(pauseIcon, {
      opacity: store.isPlaying ? 1 : 0,
      scale: store.isPlaying ? 1 : 0,
    });
  });

  onMount(() => {
    press(addIcon, (el) => {
      animate(el, {
        scale: 0.8,
      });

      return () => {
        animate(el, {
          scale: 1,
        });
      };
    });

    press(playPauseIcon, (el) => {
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
</script>

<div class="current">
  <Bg />
  <button
    class="icon play-pause"
    onclick={handleToggle}
    bind:this={playPauseIcon}
  >
    <div class="wrapper" bind:this={playIcon}>
      <Play />
    </div>
    <div class="wrapper" bind:this={pauseIcon}>
      <Pause />
    </div>
  </button>
  <button class="icon add" onclick={handleAddChapter} bind:this={addIcon}>
    <Add />
  </button>
</div>

<style>
  .current {
    position: relative;
    height: 50px;
    width: 103px;
  }

  .icon {
    position: absolute;
    height: 42px;
    width: 42px;
    border-radius: 50px;

    display: flex;
    justify-content: center;
    align-items: center;

    background-color: #609c40;
    color: #eeeeee;

    &:hover {
      background-color: #609c40;
    }
  }

  .play-pause {
    top: 4px;
    left: 4px;
  }

  .wrapper {
    width: 24px;
    height: 24px;

    position: absolute;
  }

  .add {
    top: 4px;
    right: 4px;
  }
</style>
