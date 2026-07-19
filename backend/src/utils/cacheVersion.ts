import redis from "../config/redis";

export const getCacheVersion = async (
	namespace: string,
): Promise<string> => {
	const version = await redis.get(`version:${namespace}`);

	return version || "0";
};

export const bumpCacheVersion = async (
	namespace: string,
): Promise<void> => {
	await redis.incr(`version:${namespace}`);
};
