/**
 * Vuex store module to handle Buttplug devices
 */

import { ButtplugClientDevice } from "buttplug";

interface Device {
  selected: boolean;
  buttplugDevice: ButtplugClientDevice;
}

// State definitions

interface DevicesState {
  vibrate: boolean;
  currentVibration: number; // 0.0 - 1.0
  vibrationModifier: number; // 0.0 - 1.0
  devices: Device[];
}

const state: DevicesState = {
  vibrate: true,
  currentVibration: 0.0,
  vibrationModifier: 1.0,
  devices: []
};

// Getters

const getSelectedDevice = (state: DevicesState) =>
  state.devices.find((device: Device) => device.selected);

const getComputedVibration = (state: DevicesState) =>
  state.currentVibration * state.vibrationModifier;

const getters = {
  getSelectedDevice,
  getComputedVibration
};

// Mutations

const addDevice = (state: DevicesState, device: ButtplugClientDevice) => {
  state.devices.push({
    selected: false,
    buttplugDevice: device
  });
};

const removeDevice = (state: DevicesState, index: number) => {
  state.devices.splice(index, 1);
};

const selectDevice = (state: DevicesState, index: number) => {
  // Allow only one selected device (for now)
  state.devices.forEach((device, i) => {
    device.selected = i == index;
  });
};

const setVibrate = (state: DevicesState, value: boolean) => {
  state.vibrate = value;
};

const setCurrentVibration = (state: DevicesState, value: number) => {
  state.currentVibration = Math.max(0, Math.min(value, 1));
};

const setVibrationModifier = (state: DevicesState, value: number) => {
  state.vibrationModifier = Math.max(0, Math.min(value, 1));
};

const mutations = {
  addDevice,
  removeDevice,
  selectDevice,
  setVibrate,
  setCurrentVibration,
  setVibrationModifier
};

// Actions

// TODO create a Buttplug service and use it here
const actions = {};

export default {
  state,
  getters,
  mutations,
  actions
};
