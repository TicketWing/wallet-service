declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PAYPAL_ID: string;
      PAYPAL_SECRET: string;
      REDIS_USERNAME: string;
      REDIS_PASSWORD: string;
    }
  }
}

export {};
