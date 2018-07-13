import * as MongoDB from 'mongodb';
const logger = console.log;

export default class MongoAPI {
  private config;
  private url;
  private options;
  private client;
  private db;

  constructor(config) {
    this.config = config;
    this.url = `mongodb://${config.user}:${config.pass}@${config.hostArray}/${config.db}?authMechanism=${config.auth}`;
    this.options = {
      useNewUrlParser: true,
      authSource: config.authDb,
      replicaSet: `${(config.replicaSet && config.replicaSet !== '') ? '&replicaSet=' + config.replicaSet : ''}`
    };
    this.client = MongoDB.MongoClient;
    this.db = null;
    // (async ()=> this.db = await this.connect()).bind(this)();
    this.connect().then( db => this.db = db).catch(e => logger(e.toString()));
  }

  private connect(): Promise<any> {
    logger('Mongo.connect()');
    return new Promise((resolve, reject) => {
      // Perform connection and handle promi as per callback
      this.client.connect(this.url, this.options, (err, client) => {
        if (err) {
          logger(`Failed connecting to mongo: ${err}`);
          logger(`URL: ${this.url}`);
          return reject(err);
        }

        return resolve(client.db(this.config.db));
      });
    });
  }

  getRawData(collection: string, filter: object): Promise<any[]> {
    logger('Mongo.getData()');
    return new Promise((resolve, reject) => {
      this.db.collection(collection).find(filter).toArray((err: Error, data: any[]) => {
        if (err) {
          logger(`Failed getting collection data: ${err}`);
          return reject(err);
        }
        resolve(data);
      });
    });
  }

  insertData(collection, data): Promise<any> {
    return new Promise((resolve, reject) => {
      logger(`Mongo.insertData(${collection}, ${JSON.stringify(data)})`);
      data = data || {};
      data.updateTime = new Date().toISOString();
      this.db.collection(collection).insertOne(data, (err, res) => {
        if (err) {
          logger(`Failed inserting data: ${err}`);
          return reject(err);
        }
        return resolve(res);
      });
    });
  }

  insertManyData(collection, data): Promise<any> {
    return new Promise((resolve, reject) => {
      logger(`Mongo.insertData(${collection}, ${JSON.stringify(data)})`);
      data = data.map(d => {
        d.updateTime = new Date().toISOString();
        return d;
      });
      this.db.collection(collection).insertMany(data, (err, res) => {
        if (err) {
          logger(`Failed inserting data: ${err}`);
          logger('DATA:', JSON.stringify(data))
          return reject(err);
        }
        return resolve(res);
      });
    });

  }
}