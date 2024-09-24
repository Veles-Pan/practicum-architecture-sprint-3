import { Injectable, ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { MessageDto } from '../dto/message.dto';

@Injectable()
export class ParseMessagePipe implements PipeTransform<any, MessageDto> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(rawMessage: any, metadata: ArgumentMetadata): MessageDto {
    const { value, command, headers, deviceId } = rawMessage;

    const parsedMessage = new MessageDto({ value, command, headers, deviceId });

    return parsedMessage;
  }
}
