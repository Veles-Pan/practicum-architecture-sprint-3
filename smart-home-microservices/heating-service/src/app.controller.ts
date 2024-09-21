import { Controller, Param, Put, Body } from '@nestjs/common';
import { HeatingService } from './app.service';
import { UpdateTargetTemperatureDto } from './dto/update-target-temperature.dto';
import { UpdateHeatingStatusDto } from './dto/update-heating-status.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { kafkaConfig } from './kafka/kafka.config';
import { ParseMessagePipe } from './pipes/parse-message.pipe';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Heating')
@Controller('heating')
export class HeatingController {
  constructor(private readonly heatingService: HeatingService) {}

  @ApiOperation({
    summary: 'Установка целевой температуры для устройства отопления',
  })
  @ApiResponse({
    status: 200,
    description: 'Целевая температура успешно установлена.',
  })
  @ApiResponse({ status: 400, description: 'Некорректные данные.' })
  @ApiResponse({ status: 404, description: 'Устройство не найдено.' })
  @ApiParam({
    name: 'deviceId',
    description: 'Идентификатор устройства',
    type: String,
  })
  @ApiBody({
    description: 'Данные для обновления целевой температуры',
    type: UpdateTargetTemperatureDto,
  })
  @Put('devices/:deviceId/target-temperature')
  async setTargetTemperature(
    @Param('deviceId') deviceId: string,
    @Body() updateTargetTemperatureDto: UpdateTargetTemperatureDto,
  ): Promise<void> {
    await this.heatingService.setTargetTemperature(
      deviceId,
      updateTargetTemperatureDto,
    );
  }

  @ApiOperation({ summary: 'Обновление статуса отопления для устройства' })
  @ApiResponse({
    status: 200,
    description: 'Статус отопления успешно обновлен.',
  })
  @ApiResponse({ status: 400, description: 'Некорректные данные.' })
  @ApiResponse({ status: 404, description: 'Устройство не найдено.' })
  @ApiParam({
    name: 'deviceId',
    description: 'Идентификатор устройства',
    type: String,
  })
  @ApiBody({
    description: 'Данные для обновления статуса отопления',
    type: UpdateHeatingStatusDto,
  })
  @Put('devices/:deviceId/status')
  async setHeatingStatus(
    @Param('deviceId') deviceId: string,
    @Body() updateHeatingStatusDto: UpdateHeatingStatusDto,
  ): Promise<void> {
    await this.heatingService.setHeatingStatus(
      deviceId,
      updateHeatingStatusDto,
    );
  }

  // Обработчик сообщений Kafka не документируется в Swagger, так как это не HTTP-эндпоинт
  @MessagePattern(kafkaConfig.telemetryTopic)
  async getMessage(@Payload(new ParseMessagePipe()) message): Promise<void> {
    if (message.command === 'save_telemetry_data') {
      await this.heatingService.checkCurrentTemperature(message.value);
    }
    console.log(message);
  }
}
