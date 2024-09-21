import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { TelemetryService } from './app.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { TelemetryData } from './enitities/telemetry-data.entity';

@ApiTags('Telemetry')
@Controller('telemetry')
export class TelemetryController {
  constructor(private telemetryService: TelemetryService) {}

  @ApiOperation({ summary: 'Получение последних данных телеметрии устройства' })
  @ApiResponse({
    status: 200,
    description: 'Последние данные телеметрии успешно получены.',
  })
  @ApiResponse({
    status: 404,
    description: 'Данные для устройства не найдены.',
  })
  @ApiParam({
    name: 'deviceId',
    description: 'Идентификатор устройства',
    type: String,
  })
  @Get('devices/:deviceId/latest')
  getLatestTelemetry(@Param('deviceId') deviceId: string) {
    return this.telemetryService.getLatestTelemetry(deviceId);
  }

  @ApiOperation({
    summary: 'Получение исторических данных телеметрии устройства',
  })
  @ApiResponse({
    status: 200,
    description: 'Исторические данные телеметрии успешно получены.',
  })
  @ApiResponse({ status: 400, description: 'Некорректные параметры запроса.' })
  @ApiResponse({
    status: 404,
    description: 'Данные для устройства не найдены.',
  })
  @ApiParam({
    name: 'deviceId',
    description: 'Идентификатор устройства',
    type: String,
  })
  @ApiQuery({
    name: 'startTime',
    description: 'Начало периода (ISO 8601)',
    required: true,
  })
  @ApiQuery({
    name: 'endTime',
    description: 'Конец периода (ISO 8601)',
    required: true,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Максимальное количество записей',
    required: false,
    type: Number,
    example: 100,
  })
  @Get('devices/:deviceId')
  getTelemetryHistory(
    @Param('deviceId') deviceId: string,
    @Query('startTime') startTime: string,
    @Query('endTime') endTime: string,
    @Query('limit') limit: number,
  ) {
    return this.telemetryService.getTelemetryHistory(
      deviceId,
      startTime,
      endTime,
      limit,
    );
  }

  @ApiOperation({ summary: 'Сохранение данных телеметрии для устройства' })
  @ApiResponse({
    status: 201,
    description: 'Данные телеметрии успешно сохранены.',
  })
  @ApiResponse({ status: 400, description: 'Некорректные данные.' })
  @ApiParam({
    name: 'deviceId',
    description: 'Идентификатор устройства',
    type: String,
  })
  @ApiBody({ description: 'Данные телеметрии', type: TelemetryData })
  @Post('devices/:deviceId')
  saveTelemetryData(
    @Param('deviceId') deviceId: string,
    @Body() data: Partial<TelemetryData>,
  ) {
    return this.telemetryService.saveTelemetryData({
      deviceId,
      ...data,
    });
  }
}
