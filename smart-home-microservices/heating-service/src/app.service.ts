import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateHeatingStatusDto } from './dto/update-heating-status.dto';

import { UpdateTargetTemperatureDto } from './dto/update-target-temperature.dto';
import { HeatingDevice } from './enitities/heating-device.entity';
import { KafkaProducerService } from './kafka/kafka-producer.service';

@Injectable()
export class HeatingService {
  constructor(
    @InjectRepository(HeatingDevice)
    private readonly heatingRepository: Repository<HeatingDevice>,
    private readonly KafkaProducerService: KafkaProducerService,
  ) {}

  async setTargetTemperature(
    deviceId: string,
    updateTargetTemperatureDto: UpdateTargetTemperatureDto,
  ): Promise<void> {
    const { targetTemperature } = updateTargetTemperatureDto;

    let heatingDevice = await this.heatingRepository.findOne({
      where: { deviceId },
    });
    if (!heatingDevice) {
      heatingDevice = this.heatingRepository.create({ deviceId });
    }

    heatingDevice.targetTemperature = targetTemperature;
    await this.heatingRepository.save(heatingDevice);

    await this.publishMessage(
      JSON.stringify({
        device_id: deviceId,
        command: 'set_target_temperature',
        parameters: { target_temperature: targetTemperature },
      }),
    );
  }

  async setHeatingStatus(
    deviceId: string,
    updateHeatingStatusDto: UpdateHeatingStatusDto,
  ): Promise<void> {
    const { status } = updateHeatingStatusDto;

    let heatingDevice = await this.heatingRepository.findOne({
      where: { deviceId },
    });
    if (!heatingDevice) {
      heatingDevice = this.heatingRepository.create({ deviceId });
    }

    heatingDevice.isOn = status === 'on';
    await this.heatingRepository.update({ deviceId }, heatingDevice);

    await this.publishMessage(
      JSON.stringify({
        device_id: deviceId,
        command: 'set_heating_status',
        parameters: { status },
      }),
    );
  }

  async checkCurrentTemperature({
    deviceId,
    value,
  }: {
    deviceId: string;
    value: string;
  }): Promise<void> {
    const heatingDevice = await this.heatingRepository.findOne({
      where: { deviceId },
    });

    if (!heatingDevice) {
      return;
    }

    const maxTemp = heatingDevice.targetTemperature + 1;
    const minTemp = heatingDevice.targetTemperature - 1;
    const currentTemp = parseFloat(value);

    if (currentTemp > maxTemp) {
      this.setHeatingStatus(deviceId, { status: 'off' });
    }

    if (currentTemp < minTemp) {
      this.setHeatingStatus(deviceId, { status: 'on' });
    }
  }

  publishMessage(message: string): Promise<void> {
    return this.KafkaProducerService.publish(message);
  }
}
