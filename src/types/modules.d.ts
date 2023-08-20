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

declare module "redis" {
  interface ClientOpts {
  }
  interface RedisClient {
  }
  function createClient(...args: any[]): any;
}


export {};
