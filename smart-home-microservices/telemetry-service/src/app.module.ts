import { Module } from '@nestjs/common';
import { TelemetryController } from './app.controller';
import { TelemetryService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelemetryData } from './enitities/telemetry-data.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { appConfig } from './app.config';
import { KafkaProducerModule } from './kafka/kafka-producer.module';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [appConfig], isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('databaseUrl'),
        entities: [TelemetryData],
        synchronize: true, // В реальном приложении лучше выключить
      }),
    }),
    TypeOrmModule.forFeature([TelemetryData]),
    KafkaProducerModule,
  ],
  controllers: [TelemetryController],
  providers: [ConfigService, TelemetryService],
})
export class AppModule {}
