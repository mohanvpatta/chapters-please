<script lang="ts">
  import PlayPauseBg from "./icons/play-pause-bg.svelte";
  import PlayIcon from "./icons/play.svelte";
  import PauseIcon from "./icons/pause.svelte";
  import PlusIcon from "./icons/plus.svelte";
  import { animate, hover, press } from "motion";
  import { store } from "../store.svelte";

  let playPauseButton: HTMLButtonElement;
  let addButton: HTMLButtonElement;
  let playIcon: HTMLDivElement;
  let pauseIcon: HTMLDivElement;

  let playPauseHover = $state(false);
  let addHover = $state(false);

  function handleToggle() {
    store.togglePlay();
  }

  function handleAddChapter() {
    store.addChapter();
  }

  $effect(() => {
    hover(playPauseButton, (button) => {
      animate(button, { scale: 1.1 });

      return () => {
        animate(button, { scale: 1 });
      };
    });

    press(playPauseButton, (button) => {
      animate(button, { scale: 0.9 });

      return () => {
        animate(button, { scale: playPauseHover ? 1.1 : 1 });
      };
    });

    hover(addButton, (button) => {
      animate(button, { scale: 1.1 });

      return () => {
        animate(button, { scale: 1 });
      };
    });

    press(addButton, (button) => {
      animate(button, { scale: 0.9 });

      return () => {
        animate(button, { scale: addHover ? 1.1 : 1 });
      };
    });
  });

  $effect(() => {
    if (store.isPlaying) {
      animate(playIcon, { opacity: 0, scale: 0 });
      animate(pauseIcon, { opacity: 1, scale: 1 });
    } else {
      animate(playIcon, { opacity: 1, scale: 1 });
      animate(pauseIcon, { opacity: 0, scale: 0 });
    }
  });
</script>

<div id="play-container">
  <PlayPauseBg />
  <button
    id="play-pause-button"
    bind:this={playPauseButton}
    onclick={handleToggle}
    onmouseenter={() => (playPauseHover = true)}
    onmouseleave={() => (playPauseHover = false)}
  >
    <div class="icon" bind:this={playIcon}>
      <PlayIcon />
    </div>
    <div class="icon" bind:this={pauseIcon} style:opacity="0">
      <PauseIcon />
    </div>
  </button>
  <button
    id="add-button"
    bind:this={addButton}
    onclick={handleAddChapter}
    onmouseenter={() => (addHover = true)}
    onmouseleave={() => (addHover = false)}
  >
    <PlusIcon />
  </button>
</div>

<style>
  #play-container {
    width: 103px;
    height: 50px;

    position: relative;
  }

  #play-pause-button {
    width: 42px;
    height: 42px;

    border-radius: 30px;

    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;

    top: 4px;
    left: 4px;
  }

  #add-button {
    width: 42px;
    height: 42px;

    border-radius: 30px;

    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;

    top: 4px;
    right: 4px;
  }

  .icon {
    position: absolute;
    width: 24px;
    height: 24px;

    display: flex;
    justify-content: center;
    align-items: center;
  }

  button {
    outline: none;
    border: none;
    cursor: pointer;
    background-color: transparent;
  }
</style>
