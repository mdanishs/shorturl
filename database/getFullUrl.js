import { getInstance } from './index';
import { URL_COLLECTION } from '../constants';

export const getFullUrl = async (url) => {
  let db = getInstance();
  let collection = db.collection(URL_COLLECTION);
  let storedUrl = await collection.findOne({ shortUrl: url });
  if (storedUrl) {
    return storedUrl.url
  }
  return false;
}