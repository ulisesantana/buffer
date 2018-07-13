import * as redisClient from 'redis';
import * as bluebird from 'bluebird';
const logger = console.log;

export default class RestAPI {
  private db;

  constructor(config){
    logger('Creating Redis instance');
    bluebird.promisifyAll(redisClient.RedisClient.prototype);
    bluebird.promisifyAll(redisClient.Multi.prototype);
    this.db = redisClient.createClient(config);
  }

  async get(key: string): Promise<any> {
    try {
      return JSON.parse(await this.db.getAsync(key));
    } catch (err) {
      throw err;
    }
  }

  async set(key, data): Promise<any> {
    try {
      return await this.db.setAsync(key, JSON.stringify(data));
    } catch (err) {
      throw err;
    }
  }

  async setWithExpiration(key: string, data: any, ttl: number): Promise<any> {
    try {
      return await this.db.setAsync(key, JSON.stringify(data), 'EX', ttl);
    } catch (err) {
      throw err;
    }
  }
}