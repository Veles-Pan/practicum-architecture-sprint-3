import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { appConfig } from './app.config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [appConfig], isGlobal: true }),
    ClientsModule.register([
      {
        name: 'TELEMETRY_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'telemetry_service',
          port: 3334,
        },
      },
      {
        name: 'HEATING_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'heating_service',
          port: 3355,
        },
      },
      {
        name: 'DEVICE_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'device_service',
          port: 3366,
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [ConfigService, AppService],
})
export class AppModule {}
