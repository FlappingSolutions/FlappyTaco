<template>
  <router-view />
  <BottomBar v-on:toggle-settings="toggleSettings" />
  <Settings :showSettings="showSettings" v-on:close="toggleSettings" />
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import BottomBar from "@/components/BottomBar.vue";
import Settings from "@/components/Settings.vue";

export default defineComponent({
  name: "App",
  components: {
    BottomBar,
    Settings
  },
  setup() {
    const showSettings = ref(false);

    function toggleSettings() {
      showSettings.value = !showSettings.value;
    }

    return {
      showSettings,
      toggleSettings
    };
  }
});
</script>

<style lang="scss">
html,
body {
  height: 100%;
  width: 100%;
  margin: 0px;
  background-color: #f8f8f8;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  width: 100%;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
