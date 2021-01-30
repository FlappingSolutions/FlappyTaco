import { InjectionKey } from "vue";
import { createStore, useStore as baseUseStore, Store } from "vuex";
import Devices from "./modules/devices";
import Settings from "./modules/settings";

export interface RootState {
  version: string;
}

export const key: InjectionKey<Store<RootState>> = Symbol();

export function useStore() {
  return baseUseStore(key);
}

export default createStore({
  state: {
    version: "1.0.0"
  },
  mutations: {},
  actions: {},
  modules: {
    Devices,
    Settings
  }
});
