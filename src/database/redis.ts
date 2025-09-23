import Redis from "ioredis";

const redisClient = new Redis.default({
  host: "127.0.0.1",
  port: 6379,
});

const saveCache = async (key: string, value: any) => {
  await redisClient.set(key, JSON.stringify(value));
};
const saveListCache = async (key: string, value: any) => {
  await redisClient.rpush(`list:${key}`, JSON.stringify(value));
};
const invalidadeCache = async (key: string) => {
  await redisClient.del(key);
};

const recoverCache = async <T>(key: string): Promise<T | null> => {
  const result = await redisClient.get(key);
  if (!result) return null;
  const data = JSON.parse(result) as T;
  return data;
};

const recoverListCache = async <T>(key: string): Promise<T[] | []> => {
  const result = await redisClient.lrange(`list:${key}`, 0, -1);
  if (result.length === 0) return [];

  return result.map((r) => JSON.parse(r) as T);
};

export {
  recoverCache,
  invalidadeCache,
  saveCache,
  recoverListCache,
  saveListCache,
};
