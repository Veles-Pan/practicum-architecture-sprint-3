import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TelemetryData {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  deviceId: string;

  @Column({ type: 'timestamptz' })
  timestamp: Date;

  @Column('jsonb', { nullable: true })
  data?: any;

  @Column()
  value: number;

  @Column({ nullable: true })
  unit: string;

  @Column({ type: 'timestamptz', default: () => 'NOW()' })
  createdAt: Date;
}
