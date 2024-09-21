import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Device } from './enitities/device.entity';
import { UpdateDeviceStatusDto } from './dto/update-device-status.dto';
import { SendCommandDto } from './dto/send-command.dto';
import { CreateDeviceDto } from './dto/create-device.dto';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
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

  async updateDeviceStatus(
    deviceId: string,
    updateDeviceStatusDto: UpdateDeviceStatusDto,
  ): Promise<{ message: string }> {
    const device = await this.deviceRepository.findOne({
      where: { id: deviceId },
    });
    if (!device) {
      throw new NotFoundException('Device not found');
    }

    device.status = updateDeviceStatusDto.status;
    await this.deviceRepository.save(device);

    return { message: 'Device status updated successfully.' };
  }

  async sendCommandToDevice(
    deviceId: string,
    sendCommandDto: SendCommandDto,
  ): Promise<{ message: string }> {
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
      `Sending command to device ${deviceId}: ${sendCommandDto.command}, parameters: ${JSON.stringify(
        sendCommandDto.parameters,
      )}`,
    );

    await this.deviceRepository.save(device);

    return { message: 'Command accepted for processing.' };
  }

  async createDevice(createDeviceDto: CreateDeviceDto): Promise<Device> {
    const device = this.deviceRepository.create(createDeviceDto);
    return this.deviceRepository.save(device);
  }
}
