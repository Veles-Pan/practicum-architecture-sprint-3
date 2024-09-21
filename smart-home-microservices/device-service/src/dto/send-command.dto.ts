export class SendCommandDto {
  command: string;

  deviceId: string;

  parameters: {
    status: string;
  };
}
