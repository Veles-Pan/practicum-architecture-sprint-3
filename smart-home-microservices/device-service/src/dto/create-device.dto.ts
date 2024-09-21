export class CreateDeviceDto {
  deviceTypeId: string;

  houseId: string;

  serialNumber: string;

  name?: string;

  configuration?: any;
}
