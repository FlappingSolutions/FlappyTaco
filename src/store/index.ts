import { InjectionKey } from "vue";
import { createStore, useStore as baseUseStore, Store } from "vuex";
import Devices from "./modules/devices";

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
    Devices
  }
});
