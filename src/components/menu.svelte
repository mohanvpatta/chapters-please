<script lang="ts">
  import { onMount } from "svelte";
  import Close from "./icons/close.svelte";
  import Heart from "./icons/heart.svelte";
  import MenuBg from "./icons/menu-bg.svelte";
  import Moon from "./icons/moon.svelte";
  import Move from "./icons/move.svelte";
  import { store } from "../store.svelte";

  let menuEl: HTMLDivElement;

  let isDragging = $state(false);
  let container: HTMLDivElement;

  const safeMargin = 20;

  let offsetX = 0;
  let offsetY = 0;

  let containerWidth = 494;
  let containerHeight = 0;

  function mouseDown(event: MouseEvent) {
    isDragging = true;
    // Update the container dimensions in case they have changed.
    const rect = container.getBoundingClientRect();
    containerHeight = rect.height;

    // The container's left/top are computed from current right/bottom.
    const currentLeft = window.innerWidth - store.right - containerWidth;
    const currentTop = window.innerHeight - store.bottom - containerHeight;

    // Record the offset between the mouse pointer and the container's top-left.
    offsetX = event.clientX - currentLeft;
    offsetY = event.clientY - currentTop;
  }

  function mouseMove(event: MouseEvent) {
    if (!isDragging) return;

    // New top-left of the container:
    let newLeft = event.clientX - offsetX;
    let newTop = event.clientY - offsetY;

    newLeft = Math.min(
      Math.max(newLeft, safeMargin),
      window.innerWidth - containerWidth - safeMargin
    );
    newTop = Math.min(
      Math.max(newTop, safeMargin),
      window.innerHeight - containerHeight - safeMargin
    );

    // Convert these to right/bottom values
    let newRight = window.innerWidth - (newLeft + containerWidth);
    let newBottom = window.innerHeight - (newTop + containerHeight);

    store.right = newRight;
    store.bottom = newBottom;
  }

  function mouseUp() {
    isDragging = false;
  }

  function handleResize() {
    // Update container dimensions (in case they have changed).
    if (container) {
      const rect = container.getBoundingClientRect();
      containerHeight = rect.height;
    }
    // Calculate current left/top from the current right/bottom values.
    let currentLeft = window.innerWidth - containerWidth - store.right;
    let currentTop = window.innerHeight - containerHeight - store.bottom;

    // Clamp the left and top values according to the safe area.
    currentLeft = Math.min(
      Math.max(currentLeft, safeMargin),
      window.innerWidth - containerWidth - safeMargin
    );
    currentTop = Math.min(
      Math.max(currentTop, safeMargin),
      window.innerHeight - containerHeight - safeMargin
    );

    // Recalculate right and bottom based on the clamped left/top.
    store.right = window.innerWidth - containerWidth - currentLeft;
    store.bottom = window.innerHeight - containerHeight - currentTop;
  }

  function handleAmbience() {
    store.ambience = !store.ambience;
  }

  onMount(() => {
    container = document.getElementById("app") as HTMLDivElement;

    if (container) {
      const rect = container.getBoundingClientRect();
      containerHeight = rect.height;
    }
  });

  function handleClose() {
    chrome.runtime.sendMessage({
      action: "toggle_extension",
      payload: "Toggle Extension",
    });
  }
</script>

<svelte:window
  onmousemove={mouseMove}
  onmouseup={mouseUp}
  onresize={handleResize}
/>

<div class="container" bind:this={menuEl}>
  <div class="bg">
    <MenuBg />
  </div>
  <div class="menu">
    <button class="close" onclick={handleClose}><Close /></button>
    <button
      class="move"
      onmousedown={mouseDown}
      onmouseup={mouseUp}
      class:dragging={isDragging}><Move /></button
    >
    <button
      class="ambience"
      onclick={handleAmbience}
      class:enabled={store.ambience}><Moon /></button
    >
    <a
      href="https://x.com/mohanvpatta"
      class="support"
      target="_blank"
      rel="noopener noreferrer"><Heart /></a
    >
  </div>
</div>

<style>
  .container {
    position: absolute;
    top: 0;
    left: -34px;
    width: 90px;
    height: 184px;
  }

  .enabled {
    color: #cccccc !important;
  }

  .dragging {
    cursor: grabbing !important;
    color: #cccccc !important;
  }

  .bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }

  .menu {
    display: flex;
    flex-direction: column;
    height: 145px;

    position: absolute;
    margin-top: 9px;
  }

  .close,
  .move,
  .ambience,
  .support {
    padding: 7px 10px;

    color: #666666;

    &:hover {
      color: #cccccc;
    }
  }

  .move {
    cursor: grab;
  }

  button {
    background-color: transparent;
    outline: none;
    border: none;
    cursor: pointer;

    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
