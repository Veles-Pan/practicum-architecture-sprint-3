import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { AppService } from './app.service';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateDeviceDto } from './dto/create-device.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

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
  @ApiBody({ description: 'Данные телеметрии', type: Object })
  @Post('set-telemetry/:deviceId')
  saveTelemetryData(@Param('deviceId') deviceId: string, @Body() data: any) {
    return this.appService.saveTelemetryData(deviceId, data);
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
  @Get('get-telemetry/:deviceId')
  getTelemetryHistory(
    @Param('deviceId') deviceId: string,
    @Query('startTime') startTime: string,
    @Query('endTime') endTime: string,
    @Query('limit') limit: number,
  ) {
    return this.appService.getTelemetryHistory(
      deviceId,
      startTime,
      endTime,
      limit,
    );
  }

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
  @Get('get-last-telemetry/:deviceId')
  getLatestTelemetry(@Param('deviceId') deviceId: string): any {
    return this.appService.getLatestTelemetry(deviceId);
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
    type: Object,
  })
  @Put('set-heating-status/:deviceId')
  async setHeatingStatus(
    @Param('deviceId') deviceId: string,
    @Body() data: { status: string },
  ) {
    return this.appService.setHeatingStatus(deviceId, data.status);
  }

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
    type: Object,
  })
  @Put('set-target-temperature/:deviceId')
  async setTargetTemperature(
    @Param('deviceId') deviceId: string,
    @Body() data: { targetTemperature: number },
  ) {
    return this.appService.setTargetTemperature(
      deviceId,
      data.targetTemperature,
    );
  }

  @ApiOperation({ summary: 'Регистрация нового устройства' })
  @ApiResponse({
    status: 201,
    description: 'Устройство успешно зарегистрировано.',
  })
  @ApiResponse({ status: 400, description: 'Некорректный запрос.' })
  @ApiBody({
    description: 'Данные для регистрации устройства',
    type: Object,
  })
  @Post('create-device')
  async createDevice(
    @Body()
    data: CreateDeviceDto,
  ) {
    return this.appService.createDevice(
      data.deviceTypeId,
      data.houseId,
      data.serialNumber,
      data.service,
      data.name,
      data.configuration,
    );
  }

  @ApiOperation({ summary: 'Отправка команды устройству' })
  @ApiResponse({ status: 202, description: 'Команда принята для обработки.' })
  @ApiResponse({ status: 400, description: 'Некорректный запрос.' })
  @ApiResponse({ status: 404, description: 'Устройство не найдено.' })
  @ApiParam({
    name: 'deviceId',
    description: 'Идентификатор устройства',
    type: String,
  })
  @ApiBody({
    description: 'Данные для обновления целевой температуры',
    type: Object,
  })
  @Post('commands/:deviceId')
  async sendCommandToDevice(
    @Param('deviceId') deviceId: string,
    @Body() data: { command: string; parameters: any },
  ) {
    return this.appService.sendCommandToDevice(
      deviceId,
      data.command,
      data.parameters,
    );
  }

  @ApiOperation({ summary: 'Получение информации об устройстве' })
  @ApiResponse({
    status: 200,
    description: 'Информация об устройстве возвращена.',
  })
  @ApiResponse({ status: 404, description: 'Устройство не найдено.' })
  @ApiParam({
    name: 'deviceId',
    description: 'Идентификатор устройства',
    type: String,
  })
  @Get('get-device/:deviceId')
  async getDevice(@Param('deviceId') deviceId: string): Promise<any> {
    return this.appService.getDevice(deviceId);
  }

  @ApiOperation({ summary: 'Обновление состояния устройства' })
  @ApiResponse({
    status: 200,
    description: 'Статус устройства успешно обновлен.',
  })
  @ApiResponse({ status: 400, description: 'Некорректный запрос.' })
  @ApiResponse({ status: 404, description: 'Устройство не найдено.' })
  @ApiParam({
    name: 'deviceId',
    description: 'Идентификатор устройства',
    type: String,
  })
  @ApiBody({
    description: 'Данные для обновления статуса устройства',
    type: Object,
  })
  @Put('update-device-status/:deviceId')
  async updateDeviceStatus(
    @Param('deviceId') deviceId: string,
    @Body() data: { status: string },
  ) {
    return this.appService.updateDeviceStatus(deviceId, data.status);
  }
}
