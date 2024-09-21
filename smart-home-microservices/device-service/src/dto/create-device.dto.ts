export class CreateDeviceDto {
  deviceTypeId: string;

  houseId: string;

  serialNumber: string;

  service: string;

  name?: string;

  configuration?: any;
}
