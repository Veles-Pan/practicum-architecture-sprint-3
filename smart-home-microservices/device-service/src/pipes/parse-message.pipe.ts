import { Injectable, ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { MessageDto } from '../dto/message.dto';

@Injectable()
export class ParseMessagePipe implements PipeTransform<any, MessageDto> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(rawMessage: any, metadata: ArgumentMetadata): MessageDto {
    console.log(rawMessage);

    const { device_id, command, parameters, headers } = rawMessage;

    const parsedMessage = new MessageDto({
      value: { device_id, parameters },
      command,
      headers,
    });

    return parsedMessage;
  }
}
