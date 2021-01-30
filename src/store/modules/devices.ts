/**
 * Vuex store module to handle Buttplug devices
 */

import {
  config,
  Module,
  VuexModule,
  Mutation,
  Action
} from "vuex-module-decorators";
import {
  ButtplugClient,
  ButtplugClientDevice,
  ButtplugDeviceMessageType,
  ButtplugEmbeddedConnectorOptions,
  ButtplugWebsocketConnectorOptions
} from "buttplug";
import { ConnectorType } from "./settings";

const connectorOptions = {
  [ConnectorType.EMBEDDED]: ButtplugEmbeddedConnectorOptions,
  [ConnectorType.EXTERNAL]: ButtplugWebsocketConnectorOptions
};

// Disable error wrapper for module actions
config.rawError = true;

// State definitions
@Module({
  name: "Devices",
  namespaced: true,
  stateFactory: true
})
export default class Devices extends VuexModule {
  public client: ButtplugClient | null = null;
  public isConnecting = false;
  public currentVibration = 0.0; // 0.0 - 1.0
  selectedDeviceIndex: number | null = null;

  // Get only devices that can vibrate
  get connectedDevices() {
    return this.client?.Devices.filter(device =>
      device.messageAttributes(ButtplugDeviceMessageType.VibrateCmd)
    ).sort((d1, d2) => d1.Index - d2.Index);
  }

  get selectedDevice(): ButtplugClientDevice | undefined {
    return this.client?.Devices.find(
      (device: ButtplugClientDevice) =>
        device.Index === this.selectedDeviceIndex
    );
  }

  get isConnected() {
    return this.client ? this.client.Connected : false;
  }

  get isScanning() {
    return this.client ? this.client.isScanning : false;
  }

  @Mutation
  setClient(client: ButtplugClient | null) {
    this.client = client;
  }

  @Mutation
  setIsConnecting(value: boolean) {
    this.isConnecting = value;
  }

  @Mutation
  setCurrentVibration(value: number) {
    this.currentVibration = Math.max(0, Math.min(value, 1));
  }

  // @Mutation
  // setVibrationModifier(value: number) {
  //   this.vibrationModifier = Math.max(0, Math.min(value, 1));
  // }

  @Mutation
  selectDevice(index: number | null) {
    if (index == null) {
      this.selectedDeviceIndex = null;
      return;
    }

    if (!this.client) return;

    const devices = this.client.Devices;

    if (index < devices.length && index >= 0) {
      this.selectedDeviceIndex = index;
    }
  }

  @Mutation
  devicesChanged() {
    // TODO Does this work?
    return;
  }

  @Mutation
  removeDevice(device: ButtplugClientDevice) {
    if (this.selectedDeviceIndex == device.Index) {
      this.selectedDeviceIndex = null;
    }
  }

  @Action({ commit: "setClient" })
  async connect(connector: ConnectorType) {
    if (!this.isConnected) {
      this.context.commit("setIsConnecting", true);

      const client = new ButtplugClient("Flappy Taco");

      // Setup listeners to add devices
      client.addListener("deviceadded", () => {
        this.context.commit("devicesChanged");
      });
      client.addListener("deviceremoved", device => {
        this.context.commit("deviceRemoved", device);
      });

      await client.connect(new connectorOptions[connector]());

      this.context.commit("setIsConnecting", false);

      return client;
    }

    this.context.commit("setIsConnecting", false);

    // If we're here it means that the client was already connected, so throw error
    throw "Client is already connected";
  }

  @Action
  async disconnect() {
    if (!this.isConnected) throw "Client is not connected";
    const client = (this.context.state as Devices).client;

    await client?.disconnect();
    client?.removeAllListeners();

    this.context.commit("selectDevice", null);
    this.context.commit("setClient", null);
  }

  @Action
  async startScanning() {
    if (!this.isConnected) return;
    const client = (this.context.state as Devices).client;
    await client?.startScanning();
  }

  @Action
  async stopScanning() {
    if (!this.isConnected) return;
    const client = (this.context.state as Devices).client;
    await client?.stopScanning();
  }

  @Action
  async vibrate(value?: number) {
    if (value != null) {
      this.context.commit("setCurrentVibration", value);
    }

    if (!this.isConnected) return;

    await this.selectedDevice?.vibrate(this.currentVibration);
  }

  @Action
  async stopVibration() {
    if (!this.isConnected) return;

    await this.selectedDevice?.stop();
  }
}
