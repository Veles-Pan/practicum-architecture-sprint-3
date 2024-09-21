import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TelemetryData } from './enitities/telemetry-data.entity';
import { Repository, Between } from 'typeorm';
import { KafkaProducerService } from './kafka/kafka-producer.service';

@Injectable()
export class TelemetryService {
  constructor(
    @InjectRepository(TelemetryData)
    private readonly telemetryRepository: Repository<TelemetryData>,
    private readonly KafkaProducerService: KafkaProducerService,
  ) {}

  /**
   * Получение последних данных телеметрии для указанного устройства
   * @param deviceId Идентификатор устройства
   * @returns Последняя запись телеметрии
   */
  async getLatestTelemetry(deviceId: string): Promise<TelemetryData> {
    return this.telemetryRepository.findOne({
      where: { deviceId },
      order: { timestamp: 'DESC' },
    });
  }

  /**
   * Получение исторических данных телеметрии для указанного устройства
   * @param deviceId Идентификатор устройства
   * @param startTime Начало периода
   * @param endTime Конец периода
   * @param limit Максимальное количество записей (по умолчанию 100)
   * @returns Массив записей телеметрии
   */
  async getTelemetryHistory(
    deviceId: string,
    startTime: string,
    endTime: string,
    limit: number = 100,
  ): Promise<TelemetryData[]> {
    return this.telemetryRepository.find({
      where: {
        deviceId,
        timestamp: Between(new Date(startTime), new Date(endTime)),
      },
      order: { timestamp: 'DESC' },
      take: limit,
    });
  }

  /**
   * Сохранение данных телеметрии в базу данных
   * @param telemetryData Объект данных телеметрии
   * @returns Сохраненный объект данных телеметрии
   */
  async saveTelemetryData(
    telemetryData: Partial<TelemetryData>,
  ): Promise<TelemetryData> {
    const newTelemetry = this.telemetryRepository.create(telemetryData);
    const data = await this.telemetryRepository.save(newTelemetry);

    await this.publishMessage(
      JSON.stringify({ value: data, command: 'save_telemetry_data' }),
    );

    return data;
  }

  publishMessage(message: string): Promise<void> {
    return this.KafkaProducerService.publish(message);
  }
}
