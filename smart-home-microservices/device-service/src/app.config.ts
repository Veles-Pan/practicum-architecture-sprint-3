export interface AppConfig {
  databaseUrl: string;
  port?: number;
}

export const appConfig = (): AppConfig => {
  return {
    databaseUrl: process.env.DATABASE_URL || '',
    port: +process.env.PORT || 3334,
  };
};
