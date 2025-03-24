<script lang="ts">
  import Current from "./Current.svelte";
  import Back from "./icons/back.svelte";
  import Forward from "./icons/forward.svelte";
  import { store } from "../store.svelte";
  import { animate, press } from "motion";
  import { onMount } from "svelte";

  let backIcon: HTMLButtonElement;
  let forwardIcon: HTMLButtonElement;

  function handleRewind() {
    store.rewind();
  }

  function handleForward() {
    store.forward();
  }

  onMount(() => {
    press(backIcon, (el) => {
      animate(el, {
        scale: 0.8,
      });

      return () => {
        animate(el, {
          scale: 1,
        });
      };
    });

    press(forwardIcon, (el) => {
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

<div class="playback">
  <button class="back icon" onclick={handleRewind} bind:this={backIcon}>
    <Back />
  </button>
  <Current />
  <button class="forward icon" onclick={handleForward} bind:this={forwardIcon}>
    <Forward />
  </button>
</div>

<style>
  .playback {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .icon {
    height: 36px;
    width: 36px;

    border-radius: 50px;
    color: #eeeeee;
    background-color: #3b3b3b;

    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
