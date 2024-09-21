import { Controller } from '@nestjs/common';
import { HeatingService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { kafkaConfig } from './kafka/kafka.config';
import { ParseMessagePipe } from './pipes/parse-message.pipe';

@Controller()
export class HeatingKafkaController {
  constructor(private readonly heatingService: HeatingService) {}

  @MessagePattern(kafkaConfig.telemetryTopic)
  async getMessage(@Payload(new ParseMessagePipe()) message): Promise<void> {
    if (message.command === 'save_telemetry_data') {
      console.log('Kafka save_telemetry_data');
      await this.heatingService.checkCurrentTemperature(message.value);
    }
    console.log(message);
  }

  @MessagePattern(kafkaConfig.heatingTopic)
  async getMessagee(@Payload(new ParseMessagePipe()) message): Promise<void> {
    if (message.command === 'create_device') {
      console.log('Kafka create_device', message.value);
      await this.heatingService.createDevice(message.value);
    }
    console.log(message);
  }
}
