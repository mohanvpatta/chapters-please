<script lang="ts">
  import Clear from "./icons/clear.svelte";
  import Move from "./icons/move.svelte";
  import Moon from "./icons/moon.svelte";

  import ToolbarBg from "./icons/toolbar-bg.svelte";
  import { store } from "../store.svelte";

  let toolbarEl: HTMLDivElement;
  let isDragging = false;

  let offsetX = 0;
  let offsetY = 0;

  function handleMouseDown(event: MouseEvent) {
    isDragging = true;

    // Calculate offset from the window's right and bottom edges
    offsetX = window.innerWidth - event.clientX - store.x;
    offsetY = window.innerHeight - event.clientY - store.y;

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  }

  function handleMouseMove(event: MouseEvent) {
    if (isDragging && toolbarEl) {
      const toolbarWidth = toolbarEl.offsetWidth;
      const toolbarHeight = toolbarEl.offsetHeight;

      // Raw new positions from mouse
      const x = window.innerWidth - event.clientX - offsetX;
      const y = window.innerHeight - event.clientY - offsetY;

      // Clamp so the toolbar doesn't move outside the viewport
      const clampedX = Math.min(
        Math.max(0, x),
        window.innerWidth - toolbarWidth
      );
      const clampedY = Math.min(
        Math.max(0, y),
        window.innerHeight - toolbarHeight
      );

      store.x = clampedX;
      store.y = clampedY;
    }
  }

  function handleMouseUp() {
    // Stop dragging
    isDragging = false;

    // Remove global listeners
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  }

  function handleAmbience() {
    store.ambience = !store.ambience;
  }

  function handleClose() {
    chrome.runtime.sendMessage({
      action: "toggle_extension",
      payload: "Toggle Extension",
    });
  }
</script>

<div class="toolbar" bind:this={toolbarEl}>
  <div class="bg">
    <ToolbarBg />
  </div>
  <div class="left">
    <button id="close" onclick={handleClose}>
      <Clear />
    </button>
    <button id="move" onmousedown={handleMouseDown}>
      <Move />
    </button>
  </div>
  <button id="ambience" onclick={handleAmbience} class:enabled={store.ambience}>
    <Moon />
  </button>
</div>

<style>
  .toolbar {
    height: 38px;
    display: flex;
    gap: 16px;
    position: absolute;
    top: -38px;

    background-color: transparent;
  }

  .enabled {
    color: #bbbbbb !important;
  }

  .left {
    display: flex;
    gap: 4px;

    margin-left: 14px;
  }

  .bg {
    position: absolute;
    inset: 0;

    z-index: 1;
  }

  #move {
    cursor: grab;
    user-select: none;

    color: #666666;
  }

  #move:active {
    cursor: grabbing;
  }

  button {
    padding: 2px;
    color: #666666;
    background-color: transparent;
    margin-top: 8px;

    z-index: 2;
  }

  #move:hover,
  #close:hover {
    color: #bbbbbb;
  }
</style>
