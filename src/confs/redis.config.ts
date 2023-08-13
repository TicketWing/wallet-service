export const redisConfig = {
  port: 6379,
  host: "ticket-redis",
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  db: 0,
};