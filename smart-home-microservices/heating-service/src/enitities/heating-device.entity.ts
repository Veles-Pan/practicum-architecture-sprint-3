// heating/entities/heating-device.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class HeatingDevice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  deviceId: string; // ID устройства из Device Service

  @Column({ default: false })
  isOn: boolean;

  @Column('float', { nullable: true })
  targetTemperature: number;

  @Column({ type: 'timestamptz', default: () => 'NOW()' })
  updatedAt: Date;
}
