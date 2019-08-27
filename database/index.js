import { MongoClient } from 'mongodb';
import { DB_NAME, DB_CONNECTION } from '../constants';

var _db;
export const connectToServer = (callback) => {
  MongoClient.connect(DB_CONNECTION, { useNewUrlParser: true }, (err, client) => {
    _db = client.db(DB_NAME);
    return callback(err);
  });
}

export const getInstance = () => {
  return _db;
}

export * from './getshorturl';