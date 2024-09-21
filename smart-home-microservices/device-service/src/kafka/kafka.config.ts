export const kafkaConfig = {
  clientId: 'kafka-smart-home',
  groupId: 'device-consumerr',
  heatingTopic: 'kafkaHeating',
  brokers: process.env.KAFKA_BROKER,
  connectionTimeout: 3000,
  authenticationTimeout: 1000,
  reauthenticationThreshold: 10000,
};
