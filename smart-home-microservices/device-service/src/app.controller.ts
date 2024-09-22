import { Controller } from '@nestjs/common';
import { DeviceService } from './app.service';
import { UpdateDeviceStatusDto } from './dto/update-device-status.dto';
import { SendCommandDto } from './dto/send-command.dto';
import { CreateDeviceDto } from './dto/create-device.dto';
import { ApiTags } from '@nestjs/swagger';
import { Device } from './enitities/device.entity';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { kafkaConfig } from './kafka/kafka.config';
import { ParseMessagePipe } from './pipes/parse-message.pipe';

@ApiTags('Device')
@Controller('devices')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @MessagePattern('update-device-status')
  getLatestTelemetry(data: { data: UpdateDeviceStatusDto }) {
    return this.deviceService.updateDeviceStatus(data.data);
  }

  @MessagePattern('send-command-to-device')
  sendCommandToDevice(data: { data: SendCommandDto }) {
    return this.deviceService.sendCommandToDevice(data.data);
  }

  @MessagePattern('get-device')
  getDevice(data: { deviceId: string }): Promise<Device> {
    return this.deviceService.getDevice(data.deviceId);
  }

  @MessagePattern('create-device')
  createDevice(@Payload() data: CreateDeviceDto): Promise<Device> {
    return this.deviceService.createDevice(data);
  }

  @MessagePattern(kafkaConfig.heatingTopic)
  async getMessage(@Payload(new ParseMessagePipe()) message): Promise<void> {
    if (message.command === 'set_heating_status') {
      console.log('set_heating_status', message.command, message.value);
      await this.deviceService.sendCommandToDevice({
        deviceId: message.value.deviceId,
        command: message.command,
        parameters: message.value.parameters,
      });
    }
  }
}
