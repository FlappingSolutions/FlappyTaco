<template>
  <Modal :show="showSettings">
    <template v-slot:header>
      <h3>Settings</h3>
    </template>
    <template v-slot:content>
      <h5>Vibration level: {{ vibrationModifier }}</h5>
      <input
        type="range"
        min="0"
        max="10"
        :value="vibrationModifier"
        @change="setVibrationModifier"
      />
    </template>
  </Modal>
</template>

<script lang="ts">
import Modal from "@/components/Modal.vue";
import { computed, defineComponent } from "vue";
import { useStore } from "@/store";

export default defineComponent({
  name: "Settings",
  components: { Modal },
  props: ["showSettings"],
  setup() {
    const { state, commit } = useStore();
    const { devices } = state;

    return {
      vibrationModifier: computed(
        () => Number(devices?.vibrationModifier) * 10
      ),
      setVibrationModifier: (e: Event) =>
        commit(
          "devices/setVibrationModifier",
          Number((e.target as HTMLInputElement).value) / 10
        )
    };
  }
});
</script>
