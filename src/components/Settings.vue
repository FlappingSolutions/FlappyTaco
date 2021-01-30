<template>
  <Modal :show="showSettings">
    <template v-slot:header>
      <h3>Settings</h3>
    </template>
    <template v-slot:content>
      <h5>Enable vibration:</h5>
      <input
        type="checkbox"
        :checked="vibrationEnabled"
        @change="setVibrationEnabled"
      />
      <h5>Vibration level: {{ vibrationModifier }}</h5>
      <input
        type="range"
        min="0"
        max="10"
        :value="vibrationModifier"
        @change="setVibrationModifier"
      />
      <div class="h-divider" />
      <h5>Buttplug status: {{ isConnected ? "Connected" : "Disconnected" }}</h5>
      <div class="buttplug-controls">
        <button @click="toggleConnection" :disabled="isConnecting">
          {{ isConnected ? "Disconnect" : "Connect" }}
        </button>
      </div>
    </template>
  </Modal>
</template>

<script lang="ts">
import Modal from "@/components/Modal.vue";
import { computed, defineComponent } from "vue";
import { useStore } from "@/store";
import { getModule } from "vuex-module-decorators";
import Devices from "@/store/modules/devices";
import Settings from "@/store/modules/settings";

export default defineComponent({
  name: "Settings",
  components: { Modal },
  props: ["showSettings"],
  setup() {
    const store = useStore();
    const devicesStore = getModule(Devices, store);
    const settingsStore = getModule(Settings, store);

    return {
      vibrationModifier: computed(() => {
        return Number(settingsStore.vibrationModifier) * 10;
      }),
      setVibrationModifier: (e: Event) =>
        settingsStore.setVibrationModifier(
          Number((e.target as HTMLInputElement).value) / 10
        ),
      vibrationEnabled: computed(() => settingsStore.vibrationEnabled),
      setVibrationEnabled: (e: Event) => {
        settingsStore.setVibrationEnabled(
          Boolean((e.target as HTMLInputElement).checked)
        );
      },
      isConnected: computed(() => devicesStore.isConnected),
      toggleConnection: async () => {
        try {
          devicesStore.isConnected
            ? await devicesStore.disconnect()
            : await devicesStore.connect(settingsStore.connector);
        } catch (error) {
          console.error(error);
        }
      },
      isConnecting: computed(() => devicesStore.isConnecting)
    };
  }
});
</script>

<style lang="scss" scoped>
.h-divider {
  width: 100%;
  height: 2px;
  border-radius: 1px;
  background-color: #000000;
}
</style>
