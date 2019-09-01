import { MongoClient } from 'mongodb';
import { DB_NAME, DB_CONNECTION } from '../constants';

let _db;
export const connectToServer = async (callback) => {
  let client = await MongoClient.connect(DB_CONNECTION, { useUnifiedTopology: true, useNewUrlParser: true });
  _db = client.db(DB_NAME);
  return client;
}

export const getInstance = () => {
  return _db;
}

export * from './getshorturl';
export * from './getFullUrl';