// device/entities/device.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Device {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  deviceTypeId: string;

  @Column()
  houseId: string;

  @Column()
  service: string;

  @Column()
  serialNumber: string;

  @Column({ default: 'inactive' })
  status: string;

  @Column()
  name: string;

  @Column('jsonb', { nullable: true })
  configuration: any;

  @Column({ type: 'timestamptz', nullable: true })
  installedAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  lastActiveAt: Date;

  @Column({ type: 'timestamptz', default: () => 'NOW()' })
  createdAt: Date;

  @Column({ type: 'timestamptz', default: () => 'NOW()', onUpdate: 'NOW()' })
  updatedAt: Date;
}
