import { Module } from '@nestjs/common';
import { HeatingTcpController } from './app.controller';
import { HeatingService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HeatingDevice } from './enitities/heating-device.entity';
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
        entities: [HeatingDevice],
        synchronize: true, // В реальном приложении лучше выключить
      }),
    }),
    TypeOrmModule.forFeature([HeatingDevice]),
    KafkaProducerModule,
  ],
  controllers: [HeatingTcpController],
  providers: [ConfigService, HeatingService],
})
export class AppModule {}
