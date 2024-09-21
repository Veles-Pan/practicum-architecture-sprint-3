export const kafkaConfig = {
  clientId: 'kafka-smart-home',
  groupId: 'heating-consumer',
  telemetryTopic: 'kafka-telemetry',
  heatingTopic: 'kafka-heating',
  brokers: 'localhost:9092',
  connectionTimeout: 3000,
  authenticationTimeout: 1000,
  reauthenticationThreshold: 10000,
};
