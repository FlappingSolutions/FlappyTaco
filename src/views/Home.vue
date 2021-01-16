<template>
  <div class="home">
    <Game />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Game from "@/components/Game.vue";

export default defineComponent({
  name: "Home",
  components: {
    Game
  }
});
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>
