import { getInstance } from './index';
import { ObjectId } from 'mongodb';
import {
  PEEKABOO_COLLECTION
} from '../constants';


export const getAllPeekabooRestaurants = async () => {
  let db = getInstance();
  let collection = db.collection(PEEKABOO_COLLECTION);
  return await collection.find({merged:{$exists:false}}).toArray();
}

export const updatePeekabooRestaurant = async (data) => {
  let db = getInstance();
  let collection = db.collection(PEEKABOO_COLLECTION);
  let id =  ObjectId(data._id);
  delete data._id;
  return await collection.update({_id: id}, {
    $set:{...data}
  });
}