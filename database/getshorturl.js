import { getInstance } from './index';
import { URL_COLLECTION } from '../constants';


export const  insertLongUrl = async (url) => {
  let db = getInstance();
  let collection = db.collection(URL_COLLECTION);
  await collection.insertOne({
    url
  });
  return await collection.countDocuments();
}