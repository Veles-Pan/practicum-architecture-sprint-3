export const kafkaConfig = {
  clientId: 'kafka-smart-home',
  groupId: 'telemetry-consumer',
  telemetryTopic: 'kafka-telemetry',
  brokers: 'localhost:9092',
  connectionTimeout: 3000,
  authenticationTimeout: 1000,
  reauthenticationThreshold: 10000,
};
