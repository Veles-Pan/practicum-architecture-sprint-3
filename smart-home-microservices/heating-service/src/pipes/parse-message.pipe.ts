import { Injectable, ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { MessageDto } from '../dto/message.dto';

@Injectable()
export class ParseMessagePipe implements PipeTransform<any, MessageDto> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(rawMessage: any, metadata: ArgumentMetadata): MessageDto {
    console.log(rawMessage);
    const { value, command, headers } = rawMessage;

    const parsedMessage = new MessageDto({ value, command, headers });

    return parsedMessage;
  }
}
