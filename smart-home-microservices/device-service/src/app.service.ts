import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Device } from './enitities/device.entity';
import { UpdateDeviceStatusDto } from './dto/update-device-status.dto';
import { SendCommandDto } from './dto/send-command.dto';
import { CreateDeviceDto } from './dto/create-device.dto';
import { KafkaProducerService } from './kafka/kafka-producer.service';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
    private readonly KafkaProducerService: KafkaProducerService,
  ) {}

  async getDevice(deviceId: string): Promise<Device> {
    const device = await this.deviceRepository.findOne({
      where: { id: deviceId },
    });
    if (!device) {
      throw new NotFoundException('Device not found');
    }
    return device;
  }

  async updateDeviceStatus(updateDeviceStatusDto: UpdateDeviceStatusDto) {
    const { deviceId, status } = updateDeviceStatusDto;

    const device = await this.deviceRepository.findOne({
      where: { id: deviceId },
    });
    if (!device) {
      throw new NotFoundException('Device not found');
    }

    device.status = status;
    const newDevice = await this.deviceRepository.save(device);

    return newDevice;
  }

  async sendCommandToDevice(
    sendCommandDto: SendCommandDto,
  ): Promise<{ message: string }> {
    const { deviceId, command, parameters } = sendCommandDto;

    const device = await this.deviceRepository.findOne({
      where: { id: deviceId },
    });
    if (!device) {
      throw new NotFoundException('Device not found');
    }

    device.status =
      sendCommandDto.parameters.status === 'on' ? 'active' : 'inactive';

    await this.deviceRepository.save(device);

    // Отправка команды устройству
    console.log(
      `Sending command to device ${deviceId}: ${command}, parameters: ${JSON.stringify(
        parameters,
      )}`,
    );

    await this.deviceRepository.save(device);

    return { message: 'Command accepted for processing.' };
  }

  async createDevice(createDeviceDto: CreateDeviceDto): Promise<Device> {
    const device = this.deviceRepository.create(createDeviceDto);
    const newData = await this.deviceRepository.save(device);

    if (createDeviceDto.service === 'heating') {
      await this.publishMessage(
        JSON.stringify({ value: newData.id, command: 'create_device' }),
      );
    }

    return newData;
  }

  publishMessage(message: string): Promise<void> {
    return this.KafkaProducerService.publish(message);
  }
}
