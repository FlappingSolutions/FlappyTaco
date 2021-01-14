<template>
  <div id="game-container" />
</template>

<script lang="ts">
import { Application, Sprite } from "pixi.js";
import * as tacoImage from "../assets/taco.png";
export default {
  name: "Game",
  mounted() {
    const app = new Application({
      height: 480,
      width: 640,
      antialias: true,
      backgroundColor: 0x444444
    });

    app.loader.add("taco", tacoImage).load(() => {
      const taco = new Sprite(app.loader.resources["taco"].texture);
      taco.anchor.set(0.5, 0.5);
      taco.scale.set(0.4, 0.4);
      taco.position.set(320, 240);

      app.stage.addChild(taco);
      document.getElementById("game-container")?.appendChild(app.view);
    });
  }
};
</script>

<style lang="scss" scoped>
#game-container {
  height: 480px;
  width: 640px;
  background-color: #1c1c1c;
}
</style>
