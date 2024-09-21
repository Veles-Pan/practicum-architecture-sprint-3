import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { kafkaConfig } from './kafka/kafka.config';

async function bootstrap() {
  // Создание основного приложения
  const app = await NestFactory.create(AppModule);

  // Подключение TCP как микросервиса
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: 'heating_service',
      port: 3355,
    },
  });

  // Подключение Kafka как микросервиса
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

  // Запуск всех микросервисов
  await app.startAllMicroservices();

  // Запуск основного приложения
  await app.listen(3335);
}

bootstrap();
