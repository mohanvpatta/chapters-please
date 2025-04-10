<script>
  import { store } from "../store.svelte";
</script>

<div id="note">
  {#if store.message}
    {store.message}
  {:else}
    {store.chapters.length} chapters are sorted and saved!
  {/if}
</div>

<style>
  #note {
    margin-top: 16px;
    color: #676767;
    text-align: center;
    user-select: none;
  }
</style>
