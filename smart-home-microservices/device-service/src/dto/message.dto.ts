export class MessageDto {
  readonly value: {
    readonly deviceId: string;
    readonly parameters: any;
  };
  readonly command: string;
  readonly headers: any;

  constructor(partial: Partial<MessageDto>) {
    Object.assign(this, partial);
  }
}
