import { getInstance } from './index';
import { URL_COLLECTION } from '../constants';
import { toBase62 } from '../utils';


export const createOrGetShortUrl = async (url) => {
  let db = getInstance();
  let collection = db.collection(URL_COLLECTION);
  let storedUrl = await collection.findOne({ url: url })
  
  if (storedUrl) {
    return storedUrl.shortUrl
  }
  let inserted = await collection.insertOne({
    url
  });

  if (inserted.result.ok === 1) {
    let totalCount = await collection.countDocuments();
    let shortUrl = toBase62(totalCount);
    await collection.updateOne({ url: url }, { $set: { shortUrl: shortUrl } });
    return shortUrl;
  }
  return false;
}