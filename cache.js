import { Redis } from "@upstash/redis";

const getClient = () => {
  if (!process.env.REDIS_URL || !process.env.REDIS_TOKEN) {
    throw new Error(
      "Please set REDIS_URL and REDIS_TOKEN in your environment variables."
    );
  }
  return new Redis({
    url: process.env.REDIS_URL,
    token: process.env.REDIS_TOKEN,
  });
};

export const client = getClient();
