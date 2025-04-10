<script lang="ts">
  import { animate, hover, press, spring } from "motion";
  import CopyIcon from "./icons/copy.svelte";
  import CheckIcon from "./icons/check.svelte";
  import { store } from "../store.svelte";
  import { getTimestamp } from "../utils";

  let buttonHover = $state(false);

  let copyButton: HTMLButtonElement;
  let copyIcon: HTMLDivElement;
  let checkIcon: HTMLDivElement;

  function handleCopyToClipboard() {
    const formattedChapters = store.chapters
      .map(({ timestamp, title }) => `${getTimestamp(timestamp)} ${title}`)
      .join("\n");
    navigator.clipboard
      .writeText(formattedChapters)
      .then(() => {
        copyAnimation();
        store.message = `${store.chapters.length} chapters copied to clipboard!`;
      })
      .catch((error) => {
        store.message = "Failed to copy chapters";
      });
  }

  function copyAnimation() {
    animate([
      [copyIcon, { opacity: 0, scale: 0 }, { duration: 0.4, type: spring }],
      [
        checkIcon,
        { opacity: 1, scale: 1 },
        { duration: 0.2, type: spring, at: 0.2 },
      ],
      [
        checkIcon,
        { opacity: 0, scale: 0 },
        { delay: 1, duration: 0.4, type: spring },
      ],
      [
        copyIcon,
        { opacity: 1, scale: 1 },
        { duration: 0.4, type: spring, at: "-0.3" },
      ],
    ]);
  }

  $effect(() => {
    hover(copyButton, (button) => {
      animate(button, { scale: 1.1 });
      store.message = `Copy ${store.chapters.length} chapters`;

      return () => {
        animate(button, { scale: 1 });
        store.message = null;
      };
    });

    press(copyButton, (button) => {
      animate(button, { scale: 0.9 });

      return () => {
        animate(button, {
          scale: buttonHover ? 1.1 : 1,
        });
      };
    });
  });
</script>

<button
  id="copy-button"
  bind:this={copyButton}
  onmouseenter={() => (buttonHover = true)}
  onmouseleave={() => (buttonHover = false)}
  onclick={handleCopyToClipboard}
>
  <div id="copy-icon" class="icon" bind:this={copyIcon}>
    <CopyIcon />
  </div>
  <div id="check-icon" class="icon" bind:this={checkIcon} style:opacity="0">
    <CheckIcon />
  </div>
</button>

<style>
  #copy-button {
    width: 36px;
    height: 36px;
    background-color: #252525;

    border-radius: 30px;

    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  .icon {
    position: absolute;
    width: 20px;
    height: 20px;
  }

  button {
    outline: none;
    border: none;
    cursor: pointer;

    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
