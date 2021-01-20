/**
 * Vuex store module to handle Buttplug devices
 */

import {
  Module,
  VuexModule,
  Mutation,
  Action,
  MutationAction
} from "vuex-module-decorators";
import {
  ButtplugClient,
  ButtplugClientDevice,
  ButtplugDeviceMessageType,
  ButtplugEmbeddedConnectorOptions,
  ButtplugWebsocketConnectorOptions
} from "buttplug";

export enum ConnectorType {
  "EMBEDDED",
  "EXTERNAL"
}

const connectorOptions = {
  [ConnectorType.EMBEDDED]: ButtplugEmbeddedConnectorOptions,
  [ConnectorType.EXTERNAL]: ButtplugWebsocketConnectorOptions
};

// State definitions
@Module({
  name: "Devices",
  namespaced: true,
  stateFactory: true
})
export default class Devices extends VuexModule {
  public client: ButtplugClient | null = null;
  connector: ConnectorType = ConnectorType.EXTERNAL;
  public vibrationEnabled = true;
  public currentVibration = 0.0; // 0.0 - 1.0
  public vibrationModifier = 1.0; // 0.0 - 1.0
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

  get computedVibration() {
    return this.currentVibration * this.vibrationModifier;
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
  setConnector(connector: ConnectorType) {
    this.connector = connector;
  }

  @Mutation
  setVibrate(value: boolean) {
    this.vibrationEnabled = value;
  }

  @Mutation
  setCurrentVibration(value: number) {
    this.currentVibration = Math.max(0, Math.min(value, 1));
  }

  @Mutation
  setVibrationModifier(value: number) {
    this.vibrationModifier = Math.max(0, Math.min(value, 1));
  }

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

  // Utility method to get the client only if it's connected
  async getClient(): Promise<ButtplugClient> {
    if (!this.client?.Connected) {
      throw "Client is not connected";
    }

    return this.client;
  }

  @Action({ commit: "client" })
  async connect() {
    try {
      await this.getClient();
    } catch (_) {
      const client = new ButtplugClient("Flappy Taco");

      // Setup listeners to add devices
      client.addListener("deviceadded", () => {
        this.context.commit("devicesChanged");
      });
      client.addListener("deviceremoved", device => {
        this.context.commit("deviceRemoved", device);
      });

      await client.connect(new connectorOptions[this.connector]());

      return client;
    }

    // If we're here it means that the client was already connected, so throw error
    throw "Client already connected";
  }

  @MutationAction({ mutate: ["selectedDeviceIndex", "client"] })
  async disconnect() {
    const client = await this.getClient();

    await client.disconnect();
    client.removeAllListeners();

    return {
      selectedDeviceIndex: null,
      client: null
    };
  }

  @Action
  async startScanning() {
    const client = await this.getClient();
    await client.startScanning();
  }

  @Action
  async stopScanning() {
    const client = await this.getClient();
    await client.stopScanning();
  }

  @Action
  async vibrate(value?: number) {
    if (value != null) {
      this.context.commit("setCurrentVibration", value);
    }

    await this.getClient();

    const device = this.selectedDevice;
    if (this.vibrationEnabled) {
      const vibration = this.computedVibration;

      await device?.vibrate(vibration);
    } else {
      // This case shouldn't happen, but we'll handle it just in case
      await device?.stop();
    }
  }

  @Action
  async stopVibration() {
    await this.getClient();

    await this.selectedDevice?.stop();
  }

  @Action({ commit: "setVibrationEnabled" })
  async enableVibration(startNow = false) {
    await this.getClient();

    if (startNow) {
      await this.context.dispatch("vibrate");
    }

    return true;
  }

  @Action({ commit: "setVibrationEnabled" })
  async disableVibration() {
    await this.getClient();

    await this.context.dispatch("stopVibration");

    return false;
  }
}
