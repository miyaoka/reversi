<script lang="ts" setup>
import TheCanvas from "./components/TheCanvas.vue";
</script>

<template>
  <div>
    <TheCanvas />
    <div
      class="
        absolute
        right-2
        top-2
        w-12
        h-12
        bg-white
        rounded-full
        p-2
        hover:bg-yellow-400
      "
    >
      <a
        href="https://github.com/miyaoka/reversi"
        target="_blank"
        title="repository"
      >
        <img src="./assets/GitHub-Mark-64px.png" />
      </a>
    </div>
  </div>
</template>
