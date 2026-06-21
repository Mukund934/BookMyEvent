import redis from "../config/redis";

const DEFAULT_EXPIRY = 60; // 1 minute (for dashboards)

export const getCache = async (key: string) => {
    const data = await redis.get(key);
    if (!data) return null;
    return JSON.parse(data);
};

export const setCache = async (
    key: string,
    value: any,
    expiry = DEFAULT_EXPIRY,
) => {
    await redis.setex(key, expiry, JSON.stringify(value));
};

export const deleteCache = async (key: string) => {
    await redis.del(key);
};