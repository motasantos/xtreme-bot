import { Redis } from "ioredis"

export const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: (process.env.REDIS_PORT as unknown as number) || 6379,
  db: (process.env.REDIS_DB as unknown as number) || 0,
})