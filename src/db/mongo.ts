
const logger = console.log;
const MongoDB = require('mongodb');
const QUERY_LIMIT = process.env.MONGO_QUERY_LIMIT || 9999;

interface MongoApi {
  connect(): Promise<string>,
  getRawData(collection: string, filter: object): Promise<any[]>,
  insertData(collection, data: any): Promise<any>,
  insertManyData(collection, data: any[]): Promise<any>
}
/**
 * MongoDB Abstraction factory
 * @param cfg - Configuration data
 * @returns {{connect: (function())}} - Mongo abstraction class
 * @constructor
 */
export default function Mongo(cfg): MongoApi {
  logger('Creating Mongo instance');
  const URL = `mongodb://${cfg.user}:${cfg.pass}@${cfg.hostArray}/${cfg.db}?authMechanism=${cfg.auth}`;
  const OPTS = {
    useNewUrlParser: true,
    authSource: cfg.authDb,
    replicaSet: `${(cfg.replicaSet && cfg.replicaSet !== '') ? '&replicaSet='+cfg.replicaSet : ''}`
  };
  let _mongoClient = MongoDB.MongoClient;
  let _db = null;

  // Factory object
  return {
    connect(): Promise<any> {
      logger('Mongo.connect()');
      return new Promise((resolve, reject) => {
        // Perform connection and handle promi as per callback
        _mongoClient.connect(URL, OPTS, (err, client) => {
          if (err) {
            logger(`Failed connecting to mongo: ${err}`);
            logger(`URL: ${URL}`);
            return reject(err);
          }

          _db = client.db(cfg.db);
          return resolve('connected');
        });
      });
    },
    getRawData(collection: string, filter: object): Promise<any[]> {
      logger('Mongo.getData()');
      return new Promise((resolve, reject) => {
        _db.collection(collection).find(filter).toArray((err: Error, data: any[]) => {
          if(err) {
            logger(`Failed getting collection data: ${err}`);
            return reject(err);
          }
          resolve(data);
        });
      });
    },
    insertData(collection, data): Promise<any> {
      return new Promise((resolve, reject) => {
        logger(`Mongo.insertData(${collection}, ${JSON.stringify(data)})`);
        data = data || {};
        data.updateTime = new Date().toISOString();
        _db.collection(collection).insertOne(data, (err, res) => {
          if (err) {
            logger(`Failed inserting data: ${err}`);
            return reject(err);
          }
          return resolve(res);
        });
      });

    },
    insertManyData(collection, data): Promise<any> {
      return new Promise((resolve, reject) => {
        logger(`Mongo.insertData(${collection}, ${JSON.stringify(data)})`);
        data = data.map(d => {
          d.updateTime = new Date().toISOString();
          return d;
        });
        _db.collection(collection).insertMany(data, (err, res) => {
          if (err) {
            logger(`Failed inserting data: ${err}`);
            logger('DATA:', JSON.stringify(data))
            return reject(err);
          }
          return resolve(res);
        });
      });

    },
  };
}

