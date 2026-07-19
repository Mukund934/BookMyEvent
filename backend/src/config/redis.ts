import Redis from "ioredis";


const client = new Redis(process.env.REDIS_URL as string, {
    maxRetriesPerRequest: 2,
});

client.on("connect", () => {
    console.log("Redis Connected");
});

client.on("error", (err) => {
    console.error("Redis Error:", err);
});

const redis = {
    get: async (key: string): Promise<string | null> => {
        try {
            return await client.get(key);
        } catch {
            return null;
        }
    },

    set: async (
        key: string,
        value: string,
        mode: "EX",
        ttl: number,
    ): Promise<void> => {
        try {
            await client.set(key, value, mode, ttl);
        } catch {
            return;
        }
    },

    setex: async (
        key: string,
        seconds: number,
        value: string,
    ): Promise<void> => {
        try {
            await client.setex(key, seconds, value);
        } catch {
            return;
        }
    },

    del: async (...keys: string[]): Promise<void> => {
        try {
            await client.del(...keys);
        } catch {
            return;
        }
    },

    incr: async (key: string): Promise<void> => {
        try {
            await client.incr(key);
        } catch {
            return;
        }
    },
};

export default redis;
