import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppConfig } from './app.config';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { kafkaConfig } from './kafka/kafka.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [kafkaConfig.brokers],
      },
      consumer: {
        groupId: kafkaConfig.groupId,
      },
    },
  });

  app.startAllMicroservices();

  const config = new DocumentBuilder()
    .setTitle('Device Service')
    .setDescription('API для управления девайсами')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const appCongig = app.get(ConfigService);

  const port = appCongig.get<AppConfig['port']>('port', 3336);

  await app.listen(port);
}
bootstrap();
