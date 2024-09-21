import { Controller } from '@nestjs/common';
import { TelemetryService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { TelemetryData } from './enitities/telemetry-data.entity';
import { MessagePattern } from '@nestjs/microservices';

@ApiTags('Telemetry')
@Controller('telemetry')
export class TelemetryController {
  constructor(private telemetryService: TelemetryService) {}

  @MessagePattern('get-telemetry')
  getLatestTelemetry(data: { deviceId: string }) {
    console.log('telemetry', data);
    return this.telemetryService.getLatestTelemetry(data.deviceId);
  }

  @MessagePattern('get-telemetry-history')
  getTelemetryHistory(data: {
    deviceId: string;
    startTime: string;
    endTime: string;
    limit: number;
  }) {
    console.log('telemetry history', data);
    return this.telemetryService.getTelemetryHistory(
      data.deviceId,
      data.startTime,
      data.endTime,
      data.limit,
    );
  }

  @MessagePattern('save-telemetry-data')
  saveTelemetryData(data: { data: { data: Partial<TelemetryData> } }) {
    console.log('telemetry save', data);
    return this.telemetryService.saveTelemetryData(data.data);
  }
}
