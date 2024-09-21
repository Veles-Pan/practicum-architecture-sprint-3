import { Controller, Get, Put, Post, Param, Body } from '@nestjs/common';
import { DeviceService } from './app.service';
import { UpdateDeviceStatusDto } from './dto/update-device-status.dto';
import { SendCommandDto } from './dto/send-command.dto';
import { CreateDeviceDto } from './dto/create-device.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Device } from './enitities/device.entity';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { kafkaConfig } from './kafka/kafka.config';
import { ParseMessagePipe } from './pipes/parse-message.pipe';

@ApiTags('Device')
@Controller('devices')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @ApiOperation({ summary: 'Получение информации об устройстве' })
  @ApiResponse({
    status: 200,
    description: 'Информация об устройстве возвращена.',
  })
  @ApiResponse({ status: 404, description: 'Устройство не найдено.' })
  @Get(':deviceId')
  async getDevice(@Param('deviceId') deviceId: string): Promise<Device> {
    return this.deviceService.getDevice(deviceId);
  }

  @ApiOperation({ summary: 'Обновление состояния устройства' })
  @ApiResponse({
    status: 200,
    description: 'Статус устройства успешно обновлен.',
  })
  @ApiResponse({ status: 400, description: 'Некорректный запрос.' })
  @ApiResponse({ status: 404, description: 'Устройство не найдено.' })
  @Put(':deviceId/status')
  async updateDeviceStatus(
    @Param('deviceId') deviceId: string,
    @Body() updateDeviceStatusDto: UpdateDeviceStatusDto,
  ): Promise<{ message: string }> {
    return this.deviceService.updateDeviceStatus(
      deviceId,
      updateDeviceStatusDto,
    );
  }

  @ApiOperation({ summary: 'Отправка команды устройству' })
  @ApiResponse({ status: 202, description: 'Команда принята для обработки.' })
  @ApiResponse({ status: 400, description: 'Некорректный запрос.' })
  @ApiResponse({ status: 404, description: 'Устройство не найдено.' })
  @Post(':deviceId/commands')
  async sendCommandToDevice(
    @Param('deviceId') deviceId: string,
    @Body() sendCommandDto: SendCommandDto,
  ): Promise<{ message: string }> {
    return this.deviceService.sendCommandToDevice(deviceId, sendCommandDto);
  }

  @ApiOperation({ summary: 'Регистрация нового устройства' })
  @ApiResponse({
    status: 201,
    description: 'Устройство успешно зарегистрировано.',
  })
  @ApiResponse({ status: 400, description: 'Некорректный запрос.' })
  @Post()
  async createDevice(
    @Body() createDeviceDto: CreateDeviceDto,
  ): Promise<Device> {
    return this.deviceService.createDevice(createDeviceDto);
  }

  @MessagePattern(kafkaConfig.heatingTopic)
  async getMessage(@Payload(new ParseMessagePipe()) message): Promise<void> {
    if (message.command === 'set_heating_status') {
      await this.deviceService.sendCommandToDevice(message.value.device_id, {
        command: message.command,
        parameters: message.value.parameters,
      });
    }
  }
}
