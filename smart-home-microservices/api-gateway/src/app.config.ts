export interface AppConfig {
  port?: number;
  telemetryServiceUrl: string;
  heatingServiceUrl: string;
  deviceServiceUrl: string;
}

export const appConfig = (): AppConfig => {
  return {
    port: +process.env.PORT || 3334,
    telemetryServiceUrl: process.env.TELEMETRY_SERVICE_URL || '',
    heatingServiceUrl: process.env.HEATING_SERVICE_URL || '',
    deviceServiceUrl: process.env.DEVICE_SERVICE_URL || '',
  };
};
