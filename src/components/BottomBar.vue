<template>
  <div class="bar">
    <button v-on:click="toggleSettings" id="settings">
      Settings
    </button>
  </div>
</template>

<script lang="ts">
import { EmitsOptions } from "@vue/test-utils/dist/mount";
import { SetupContext } from "vue";
export default {
  name: "BottomBar",
  setup(_: {}, { emit }: SetupContext<EmitsOptions>) {
    const toggleSettings = () => {
      emit("toggleSettings");
    };

    return {
      toggleSettings
    };
  }
};
</script>

<style scoped>
.bar {
  display: flex;
  position: fixed;
  bottom: 0px;
  width: 100%;
  height: 64px;
  background: rgb(101, 13, 137);
  background: linear-gradient(
    90deg,
    rgba(101, 13, 137, 1) 35%,
    rgba(146, 0, 117, 1) 100%
  );
}
#settings {
  justify-self: flex-start;
}
</style>
