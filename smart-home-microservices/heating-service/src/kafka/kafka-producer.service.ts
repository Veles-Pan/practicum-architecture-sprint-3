import { Injectable } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';

import { kafkaConfig } from './kafka.config';

@Injectable()
export class KafkaProducerService {
  private readonly kafkaInstance: Kafka;
  private producer: Producer;

  constructor() {
    this.kafkaInstance = new Kafka({
      clientId: kafkaConfig.clientId,
      brokers: [kafkaConfig.brokers],
      connectionTimeout: kafkaConfig.connectionTimeout,
      authenticationTimeout: kafkaConfig.authenticationTimeout,
      reauthenticationThreshold: kafkaConfig.reauthenticationThreshold,
    });

    this.producer = this.kafkaInstance.producer();
  }

  async publish(message: string): Promise<void> {
    await this.producer.connect();
    await this.producer.send({
      topic: kafkaConfig.heatingTopic,
      messages: [{ value: message }],
    });
  }
}
