const logger = console.log;
const redisClient = require('redis');
const bluebird = require('bluebird');

/**
 * Redis Abstraction factory
 * @param cfg - Configuration data
 * @returns {{connect: (function())}} - Mongo abstraction class
 * @constructor
 */
export default function Redis(cfg) {
  logger('Creating Redis instance');
  bluebird.promisifyAll(redisClient.RedisClient.prototype);
  bluebird.promisifyAll(redisClient.Multi.prototype);
  const _redis = redisClient.createClient(cfg);

  // Factory object
  return {
    async get(key: string): Promise<any> {
      try {
        return JSON.parse(await _redis.getAsync(key));
      } catch (err) {
        throw err;
      }
    },
    async set(key, data): Promise<any> {
      try {
        return await _redis.setAsync(key, JSON.stringify(data));
      } catch (err) {
        throw err;
      }
    },
    async setWithExpiration(key: string, data: any, ttl: number): Promise<any> {
      try {
        return JSON.parse(await _redis.setAsync(key, data, 'EX', ttl));
      } catch (err) {
        throw err;
      }
    }
  }
}
