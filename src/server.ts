import * as express from 'express';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import { Buffer } from './Buffer';
import db from './db/db ';
import mongoCfg from './config/mongo.config';


export default function server() {
  const PORT = +process.env.PORT || 3000;
  const log = console.log;
  const api = express();
  const mongo = db('mongo', mongoCfg);
  mongo.connect().then(() => {
    // Setting up the API
    api.use(morgan('dev'));
    api.use(bodyParser.urlencoded({
      extended: false,
      type: 'application/x-www-form-urlencoded'
    }));
    api.use(bodyParser.json());

    const buffer = Buffer();

    // API Routes
    api.get('/buffer/:data', async (req, res, next) => {
      try {
        const { params: { data: message } } = req;
        const { done, value: messages } = await buffer.next({ message });
        const OkMsg = 'Enqueued message'
        if (done) {
          await mongo.save('queue.messages', messages);
          res.status(200).send(`${OkMsg}. ${messages.length} stored`).end();
        } else {
          res.status(200).send(OkMsg).end();
        }
      } catch (err) {
        res.status(500).send('Internal server error: ' + err.toString()).end();
      }
    });

    api.listen(PORT, () => log(`REST API listening on port ${PORT}.`));
    return api;
  }).catch(err => console.error(err.toString()));

}



