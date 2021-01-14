<template>
  <div class="bar">
    <button v-on:click="toggleConnection" id="intiface-connect">
      {{ connected ? "Disconnect" : "Connect" }}
    </button>
  </div>
</template>

<script lang="ts">
import { inject, ref } from "vue";
import { ButtplugClient, ButtplugWebsocketConnectorOptions } from "buttplug";
export default {
  name: "BottomBar",
  setup() {
    const client: ButtplugClient | undefined = inject("buttplugClient");
    const connected = ref(false);

    const options = new ButtplugWebsocketConnectorOptions();

    const connect = () => {
      if (client) {
        client
          .connect(options)
          .then(() => {
            console.log("Connected to Intiface");
            connected.value = true;
          })
          .catch(error => {
            console.error("Could not connect to Intiface: ", error);
          });
      } else {
        console.error("Buttplug client not found");
      }
    };
    const disconnect = () => {
      if (client) {
        client
          .disconnect()
          .then(() => {
            console.log("Disconnected from Intiface");
            connected.value = false;
          })
          .catch(error => {
            console.error("Could not disconnect from Intiface: ", error);
          });
      } else {
        console.error("Buttplug client not found");
      }
    };

    const toggleConnection = () => {
      connected.value ? disconnect() : connect();
    };

    return {
      connected,
      toggleConnection
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
</style>
