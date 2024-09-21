import { Controller } from '@nestjs/common';
import { HeatingService } from './app.service';
import { UpdateTargetTemperatureDto } from './dto/update-target-temperature.dto';
import { UpdateHeatingStatusDto } from './dto/update-heating-status.dto';
import { MessagePattern } from '@nestjs/microservices';

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
}
