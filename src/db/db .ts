import MongoAPI from './mongo.api';
import RedisAPI from './redis.api';

interface DbHandler {
  connect?(): Promise<any>,
  find(filter: any): Promise<any[]>,
  save?(filter: object | string, data: any | any[]): Promise<void>
  update?(filter: object | string, data: any | any[], options?: object): Promise<void>
}

export default function db(type: string, cfg: object): DbHandler {
  switch (type) {
    case 'mongo':
      return MongoHandler(cfg);
    case 'redis':
      return RedisHandler(cfg);
  }
}

function MongoHandler(cfg): DbHandler {
  const mongo = new MongoAPI(cfg);
  return {
    async find(filter) {
      try {
        return await mongo.getRawData('messages', filter);
      } catch (err) {
        throw err;
      }
    },
    async save(collection, data) {
      try {
        if (data instanceof Array) {
          return await mongo.insertManyData(collection, data);
        } else {
          return await mongo.insertData(collection, data);
        }
      } catch (err) {
        throw err;
      }
    }
  }
}

function RedisHandler(cfg): DbHandler {
  const redis = new RedisAPI(cfg);
  return {
    async find(key) {
      try {
        return await redis.get(key);
      } catch (err) {
        throw err;
      }
    },
    async save(key, data) {
      try {
        return await redis.set(key, data);
      } catch (err) {
        throw err;
      }
    }
  }
}

