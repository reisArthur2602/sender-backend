import Redis from "ioredis";

const redisClient = new Redis.default({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT) || 6379,
});

const saveCache = async (key: string, value: any, ttl?: number) => {
  if (ttl) await redisClient.set(key, JSON.stringify(value), "EX", ttl);
  else await redisClient.set(key, JSON.stringify(value));
};

const invalidadeCache = async (key: string) => {
  await redisClient.del(key);
};

const recoverCache = async <T>(key: string): Promise<T | null> => {
  const result = await redisClient.get(key);
  if (!result) return null;
  return JSON.parse(result) as T;
};

export { recoverCache, invalidadeCache, saveCache };
