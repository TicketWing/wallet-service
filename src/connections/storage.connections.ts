import knex from "knex";
import { Redis } from "ioredis";
import knexConfig from "../../knexfile";
import { redisConfig } from "../confs/redis.config";

export const databasePool = knex(knexConfig);
export const redisClient = new Redis(redisConfig);
