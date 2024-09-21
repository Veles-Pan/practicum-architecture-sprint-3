import { Module } from '@nestjs/common';
import { DeviceController } from './app.controller';
import { DeviceService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from './enitities/device.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { appConfig } from './app.config';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [appConfig], isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('databaseUrl'),
        entities: [Device],
        synchronize: true, // В реальном приложении лучше выключить
      }),
    }),
    TypeOrmModule.forFeature([Device]),
  ],
  controllers: [DeviceController],
  providers: [ConfigService, DeviceService],
})
export class AppModule {}
