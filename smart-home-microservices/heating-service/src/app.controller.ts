import { Controller } from '@nestjs/common';
import { HeatingService } from './app.service';
import { UpdateTargetTemperatureDto } from './dto/update-target-temperature.dto';
import { UpdateHeatingStatusDto } from './dto/update-heating-status.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { kafkaConfig } from './kafka/kafka.config';
import { ParseMessagePipe } from './pipes/parse-message.pipe';

@Controller('heating')
export class HeatingTcpController {
  constructor(private readonly heatingService: HeatingService) {}

  @MessagePattern('set-target-temperature')
  getLatestTelemetry(data: { data: UpdateTargetTemperatureDto }) {
    console.log('TCP set-target-temperature');
    return this.heatingService.setTargetTemperature(data.data);
  }

  @MessagePattern('set-heating-status')
  setHeatingStatus(data: { data: UpdateHeatingStatusDto }) {
    console.log('TCP set-heating-status');
    return this.heatingService.setHeatingStatus(data.data);
  }

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
