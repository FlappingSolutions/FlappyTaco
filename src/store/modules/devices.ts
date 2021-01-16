/**
 * Vuex store module to handle Buttplug devices
 */

import { ActionContext } from "vuex";
import { ConnectorType } from "@/services/vibes";
import {
  ButtplugClient,
  ButtplugClientDevice,
  ButtplugDeviceMessageType,
  ButtplugEmbeddedConnectorOptions,
  ButtplugWebsocketConnectorOptions
} from "buttplug";

const connectorOptions = {
  [ConnectorType.EMBEDDED]: ButtplugEmbeddedConnectorOptions,
  [ConnectorType.EXTERNAL]: ButtplugWebsocketConnectorOptions
};

// State definitions

interface DevicesState {
  client: ButtplugClient | null;
  connector: ConnectorType;
  vibrate: boolean;
  currentVibration: number; // 0.0 - 1.0
  vibrationModifier: number; // 0.0 - 1.0
  selectedDevice: number | null;
}

const state: DevicesState = {
  client: null,
  connector: ConnectorType.EXTERNAL,
  vibrate: true,
  currentVibration: 0.0,
  vibrationModifier: 1.0,
  selectedDevice: null
};

// Getters

// Get only devices that can vibrate
const getDevices = (state: DevicesState) =>
  state.client?.Devices.filter(device =>
    device.messageAttributes(ButtplugDeviceMessageType.VibrateCmd)
  ).sort((d1, d2) => d1.Index - d2.Index);

const getSelectedDevice = (state: DevicesState) =>
  state.client?.Devices.find(
    (device: ButtplugClientDevice) => device.Index === state.selectedDevice
  );

const getComputedVibration = (state: DevicesState) =>
  state.currentVibration * state.vibrationModifier;

const isConnected = (state: DevicesState) =>
  state.client ? state.client.Connected : false;

const isScanning = (state: DevicesState) => {
  state.client ? state.client.isScanning : false;
};

const getters = {
  getDevices,
  getSelectedDevice,
  getComputedVibration,
  isConnected,
  isScanning
};

// Mutations

const setClient = (state: DevicesState, client: ButtplugClient | null) => {
  state.client = client;
};

const setConnector = (state: DevicesState, connector: ConnectorType) => {
  state.connector = connector;
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

const selectDevice = (state: DevicesState, index: number | null) => {
  if (index == null) {
    state.selectedDevice = null;
    return;
  }

  if (!state.client) return;

  const devices = state.client.Devices;

  if (index < devices.length && index >= 0) {
    state.selectedDevice = index;
  }
};

const devicesChanged = () => {
  // TODO Does this work?
  return;
};

const removeDevice = (state: DevicesState, device: ButtplugClientDevice) => {
  if (state.selectedDevice == device.Index) {
    state.selectedDevice = null;
  }
};

const mutations = {
  setClient,
  setConnector,
  setVibrate,
  setCurrentVibration,
  setVibrationModifier,
  devicesChanged,
  removeDevice,
  selectDevice
};

// Actions

// Utility method to get the client only if it's connected
const getClient = async (state: DevicesState): Promise<ButtplugClient> => {
  if (!state.client?.Connected) {
    throw "Client is not connected";
  }

  return state.client;
};

const connect = async ({
  state,
  commit
}: ActionContext<DevicesState, unknown>) => {
  try {
    getClient(state);
  } catch (_) {
    const client = new ButtplugClient("Flappy Taco");

    // Setup listeners to add devices
    client.addListener("deviceadded", devicesChanged);
    client.addListener("deviceremoved", removeDevice);

    await client.connect(new connectorOptions[state.connector]());

    commit("setClient", client);

    return;
  }

  // If we're here it means that the client was already connected, so throw error
  throw "Client already connected";
};

const disconnect = async ({
  state,
  commit
}: ActionContext<DevicesState, unknown>) => {
  const client = await getClient(state);

  await client.disconnect();
  client.removeAllListeners();

  commit("selectDevice", null);
  commit("setClient", null);
};

const startScanning = async ({
  state
}: ActionContext<DevicesState, unknown>) => {
  const client = await getClient(state);
  await client.startScanning();
};

const stopScanning = async ({
  state
}: ActionContext<DevicesState, unknown>) => {
  const client = await getClient(state);
  await client.stopScanning();
};

const vibrate = async (
  { state, commit }: ActionContext<DevicesState, unknown>,
  value?: number
) => {
  if (value != null) {
    commit("setCurrentVibration", value);
  }

  await getClient(state);

  const device = getSelectedDevice(state);
  if (state.vibrate) {
    const vibration = getComputedVibration(state);

    await device?.vibrate(vibration);
  } else {
    // This case shouldn't happen, but we'll handle it just in case
    await device?.stop();
  }
};

const stopVibration = async ({
  state
}: ActionContext<DevicesState, unknown>) => {
  await getClient(state);

  return await getSelectedDevice(state)?.stop();
};

const enableVibration = async (
  context: ActionContext<DevicesState, unknown>,
  startNow = false
) => {
  const { state, commit, dispatch } = context;

  commit("setVibrationEnabled", true);

  await getClient(state);

  if (startNow) {
    await dispatch("vibrate");
  }
};

const disableVibration = async ({
  state,
  commit,
  dispatch
}: ActionContext<DevicesState, unknown>) => {
  commit("setVibrationEnabled", false);

  await getClient(state);

  await dispatch("stopVibration");
};

const actions = {
  connect,
  disconnect,
  startScanning,
  stopScanning,
  vibrate,
  stopVibration,
  enableVibration,
  disableVibration
};

export default {
  state,
  getters,
  mutations,
  actions
};
