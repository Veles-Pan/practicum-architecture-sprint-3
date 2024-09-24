export class MessageDto {
  readonly value: string;
  readonly command: string;
  readonly headers: any;
  readonly deviceId?: string;

  constructor(partial: Partial<MessageDto>) {
    Object.assign(this, partial);
  }
}
