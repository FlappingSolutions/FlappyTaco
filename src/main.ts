import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store, { key } from "./store";
import { ButtplugClient, buttplugInit } from "buttplug";

buttplugInit()
  .then(() => {
    // TODO use vuex to inject the client?
    const client = new ButtplugClient();

    createApp(App)
      .use(store, key)
      .use(router)
      .provide("buttplugClient", client)
      .mount("#app");
  })
  .catch(error => {
    // TODO serve error page
    console.error("Could not initialize Buttplug:", error);
  });
