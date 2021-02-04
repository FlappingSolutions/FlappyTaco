<template>
  <div id="game-container" />
</template>

<script lang="ts">
import { Application, Sprite } from "pixi.js";
import { defineComponent } from "vue";
import Taco from "@/game/taco";
import * as tacoImage from "../assets/taco.png";
import Tube from "@/game/tube";
export default defineComponent({
  name: "Game",
  setup() {
    const app = new Application({
      height: 480,
      width: 640,
      antialias: true,
      backgroundColor: 0x444444
    });

    app.loader.add("taco", tacoImage).load(() => {
      // Create the taco object
      const taco = new Taco(16, app.loader.resources["taco"].texture);
      app.stage.addChild(taco.sprite);
      document.getElementById("game-container")?.appendChild(app.view);

      const flap = () => {
        taco.flap();
      };

      // Add tubes
      const tubes: Tube[] = [];
      for (let i = 0; i < 3; i++) {
        const tube = new Tube(640 + 240 * i, 16);
        tubes.push(tube);
        app.stage.addChild(tube.sprite);
      }

      // Use a rectangle to capture click/touch events
      const touchArea = new Sprite();
      touchArea.position.set(0, 0);
      touchArea.width = 640;
      touchArea.height = 480;
      touchArea.interactive = true;
      touchArea.on("mousedown", flap);
      touchArea.on("touchstart", flap);
      app.stage.addChild(touchArea);

      // Simple game loop
      app.ticker.add(() => {
        taco.update();
        tubes.forEach(tube => tube.update());
      });
    });
  }
});
</script>

<style lang="scss" scoped>
#game-container {
  height: 480px;
  width: 640px;
  background-color: #1c1c1c;
}
</style>
