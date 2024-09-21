export class MessageDto {
  readonly value: {
    readonly device_id: string;
    readonly parameters: any;
  };
  readonly command: string;
  readonly headers: any;

  constructor(partial: Partial<MessageDto>) {
    Object.assign(this, partial);
  }
}
