export const kafkaConfig = {
  clientId: 'kafka-smart-home',
  groupId: 'device-consumerr',
  heatingTopic: 'kafka-heating',
  brokers: 'localhost:9092',
  connectionTimeout: 3000,
  authenticationTimeout: 1000,
  reauthenticationThreshold: 10000,
};
