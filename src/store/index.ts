import { InjectionKey } from "vue";
import { createStore, useStore as baseUseStore, Store } from "vuex";
import devices, { DevicesState } from "./modules/devices";

export interface RootState {
  version: string;
  devices?: DevicesState;
}

export const key: InjectionKey<Store<RootState>> = Symbol();

export function useStore() {
  return baseUseStore(key);
}

export default createStore<RootState>({
  state: {
    version: "1.0.0"
  },
  mutations: {},
  actions: {},
  modules: {
    devices
  }
});
