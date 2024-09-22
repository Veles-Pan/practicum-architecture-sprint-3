import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class AppService {
  constructor(
    @Inject('TELEMETRY_SERVICE') private readonly telemetryService: ClientProxy,
    @Inject('HEATING_SERVICE') private readonly heatingService: ClientProxy,
    @Inject('DEVICE_SERVICE') private readonly deviceService: ClientProxy,
  ) {}

  saveTelemetryData(deviceId: string, data: any) {
    const pattern = 'save-telemetry-data';

    const payload = { data: { deviceId: deviceId, ...data } };

    return this.telemetryService
      .send<string>(pattern, payload)
      .pipe(map((message: string) => ({ message })));
  }

  getLatestTelemetry(deviceId: string) {
    const pattern = 'get-telemetry';

    const payload = { deviceId };

    return this.telemetryService.send(pattern, payload);
  }

  getTelemetryHistory(
    deviceId: string,
    startTime: string,
    endTime: string,
    limit: number,
  ) {
    const pattern = 'get-telemetry-history';

    const payload = { deviceId, startTime, endTime, limit };

    return this.telemetryService.send(pattern, payload);
  }

  setTargetTemperature(deviceId: string, targetTemperature: number) {
    const pattern = 'set-target-temperature';

    const payload = { data: { deviceId, targetTemperature } };

    return firstValueFrom(this.heatingService.send(pattern, payload));
  }

  setHeatingStatus(deviceId: string, status: string) {
    const pattern = 'set-heating-status';

    const payload = { data: { deviceId, status } };

    console.log(payload);

    return firstValueFrom(this.heatingService.send(pattern, payload));
  }

  updateDeviceStatus(deviceId: string, status: string) {
    const pattern = 'updupdate-device-status';

    const payload = { data: { deviceId, status } };

    return firstValueFrom(this.deviceService.send(pattern, payload));
  }

  getDevice(deviceId: string) {
    const pattern = 'get-device';

    const payload = { deviceId };

    return firstValueFrom(this.deviceService.send(pattern, payload));
  }

  createDevice(
    deviceTypeId: string,

    houseId: string,

    serialNumber: string,

    service: string,

    name?: string,

    configuration?: any,
  ) {
    const pattern = 'create-device';

    const payload = {
      deviceTypeId,
      houseId,
      serialNumber,
      service,
      name,
      configuration,
    };

    return firstValueFrom(this.deviceService.send(pattern, payload));
  }

  sendCommandToDevice(deviceId: string, command: string, parameters: any) {
    const pattern = 'send-command-to-device';

    const payload = { data: { deviceId, command, parameters } };

    return firstValueFrom(this.deviceService.send(pattern, payload));
  }
}
