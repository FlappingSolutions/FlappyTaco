/**
 * Vuex store module for game settings
 */

import {
  config,
  Module,
  VuexModule,
  Mutation
  // Action
} from "vuex-module-decorators";

export enum ConnectorType {
  "EMBEDDED",
  "EXTERNAL"
}

// Disable error wrapper for module actions
config.rawError = true;

@Module({
  name: "Settings",
  namespaced: true,
  stateFactory: true
})
export default class Devices extends VuexModule {
  public connector: ConnectorType = ConnectorType.EXTERNAL;
  public vibrationEnabled = true;
  public vibrationModifier = 1.0; // 0.0 - 1.0

  @Mutation
  setConnector(connector: ConnectorType) {
    this.connector = connector;
  }

  @Mutation
  setVibrationEnabled(value: boolean) {
    this.vibrationEnabled = value;
  }

  @Mutation
  setVibrationModifier(value: number) {
    this.vibrationModifier = Math.max(0, Math.min(value, 1));
  }
}
