<script lang="ts">
  import Clear from "./clear.svelte";
  import Copy from "./copy.svelte";
  import Playback from "./playback.svelte";
</script>

<div class="container">
  <Copy />
  <Playback />
  <Clear />
</div>

<style>
  .container {
    height: 70px;
    width: 408px;

    margin: 60px auto 0 auto;
    padding-bottom: 20px;

    display: flex;
    justify-content: space-between;
    align-items: center;
  }
</style>
