import { getInstance } from './index';
import { RESTAURANT_COLLECTION, FOODVISE_COLLECTION, INDEX_COLLECTION, OLD_RESTAURANT_COLLECTION } from '../constants';
import { ObjectId } from 'mongodb';
import { writeFileSync, write, readFileSync } from 'fs';
import Axios from 'axios';

export const insertIntoDB = async (restaurants) => {
  let db = getInstance();
  let collection = db.collection(RESTAURANT_COLLECTION);
  let inserted = await collection.insertMany(restaurants);
}


export const getRestaurantsWithMenu = async () => {
  let db = getInstance();
  let collection = db.collection(RESTAURANT_COLLECTION);

  let restaurants = await collection.find({ menu: { $ne: null } }).toArray();
  let count = 0;
  restaurants = restaurants.map(({ name, menu }) => {
    let m = menu.split(',');
    count += m.length;
    return {
      name,
      menu: m
    }
  });
  console.log(count);
  return restaurants;

}

export const compareData = async () => {
  let db = getInstance();
  let foodvise = db.collection(FOODVISE_COLLECTION);
  let current = await foodvise.find({}).toArray();

  let peekabu = db.collection(RESTAURANT_COLLECTION);
  let tomerge = await peekabu.find({}).toArray();

  let general = ['Restaurant', 'Hotel', 'Karachi', 'facebook'];

  let count = 0;
  tomerge.forEach(async (restN) => {
    let property = 'website';
    let propertyN = restN[property];
    if (propertyN) {
      propertyN = propertyN.replace('http://www.', "");
      propertyN = propertyN.replace('https://www.', "");
      propertyN = propertyN.replace('http://', "");
      propertyN = propertyN.replace('https://', "");

      let name = propertyN.split('.')[0];
      if (general.includes(name)) {
        propertyN = propertyN.split('/')[1];
      } else {
        propertyN = name;
      }
    }

    let matched = current.find((restO) => {
      restO['formatted_phone_number'] = restO['formatted_phone_number'] && restO['formatted_phone_number'].replace(" ", "");
      restN['contactNumber'] = restN['contactNumber'] && restN['contactNumber'].replace(" ", "");
      return (
        (
          restO[property] &&
          propertyN &&
          !general.includes(propertyN) &&
          restO[property].toLowerCase().indexOf(propertyN.toLowerCase()) >= 0
        ) ||
        (
          restO['formatted_phone_number'] &&
          restN['contactNumber'] &&
          restO['formatted_phone_number'].slice(-10).indexOf(restN['contactNumber'].slice(-10)) >= 0
        )
      )
    });
    if (matched) {
      count++;
      console.log(`new ${propertyN}  ${restN.contactNumber}`)
      console.log(`cur ${matched[property]} ${matched.formatted_phone_number}`)
      console.log()

      await foodvise.updateOne(
        { '_id': new ObjectId(matched._id) },
        {
          $set: {
            facebook: restN.facebook,
            twitter: restN.twitter,
            instagram: restN.instagram,
            menu: restN.menu,
            gallery: restN.gallery,
            logo: restN.logo,
            cover: restN.cover,
            description: restN.description
          }
        }
      )
    }
  });
  console.log(`---${count}---`)
}

export const fillRecurringUpData = async () => {
  let db = getInstance();
  let foodvise = db.collection(FOODVISE_COLLECTION);

  let recurringRestaurants = [
    'Pizza Max',
    'Pizza Hut',
    'Pizza Point',
    'Broadway Pizza',
    'Subway',
    'KFC',
    "McDonald's",
    'California Pizza'
  ]

  let current = await foodvise.find({
    name: { $in: recurringRestaurants },
    'menu.1': { $exists: true }
  }).toArray();

  let merged = {}

  current.forEach(c => {
    if (merged[c.name]) {
      let m = merged[c.name];
      if (m.menu.length < c.menu.length) {
        merged[c.name] = c;
      }
    } else {
      merged[c.name] = c
    }
  });


  // Object.keys(merged).forEach(key => {
  //   let currRes = merged[key];
  //   foodvise.updateMany({
  //     name: currRes.name,
  //     index_updated: { $exists: false }
  //   }, {
  //     $set: {
  //       facebook: currRes.facebook,
  //       twitter: currRes.twitter,
  //       instagram: currRes.instagram,
  //       gallery: currRes.gallery,
  //       logo: currRes.logo,
  //       cover: currRes.cover,
  //       description: currRes.description,
  //       menu: currRes.menu,
  //       menu_photos: currRes.menu_photos,
  //       index: currRes.menu,
  //       website: currRes.website,
  //       international_phone_number: currRes.international_phone_number,
  //       index_updated: true
  //     }
  //   })
  // })

}


export const comparepeekabu = async () => {
  let db = getInstance();
  let foodvise = db.collection(FOODVISE_COLLECTION);
  // let peekabu = db.collection(RESTAURANT_COLLECTION);


  // let foodviseArr = await foodvise.find({index_updated:{$exists: false}}).toArray();
  // let peekabuArr = await peekabu.find({merged:{$exists:false}},{keywords:1,name:1}).toArray();

  // let menu = [];
  // peekabuArr.forEach(r =>{
  //   let name = r.name.split(" ").join("").trim();
  //   r.keywords.split(',').forEach(m => {
  //     if(m.toLowerCase() !== name.toLowerCase()){
  //       menu.push(m.toLowerCase().trim());
  //     }
  //   })
  // })
  let foodviseArr = await foodvise.find({ index_updated: { $exists: false } }, { name: 1 }).toArray();
  foodviseArr = foodviseArr.map(f => f.name);
  console.log(JSON.stringify(foodviseArr.length, null, 2))

}


export const getIndexedData = async () => {
  let db = getInstance();
  let collection = db.collection(FOODVISE_COLLECTION);

  let restaurants = await collection.find({ 'menu.1': { $exists: true } }).toArray();
  let index = {};
  restaurants.forEach(r => {
    r.menu.forEach(m => {
      if (!index[m]) {
        index[m] = [r._id];
      } else {
        index[m].push(r._id)
      }
    })
  })
  let sorted = {};
  Object.keys(index).sort().forEach(r => {
    if (!sorted[r]) {
      sorted[r] = index[r];
    } else {
      sorted[r].push(index[r])
    }
  })
  console.log(Object.keys(sorted).length);
  return restaurants;
}

export const createIndexedCollection = async () => {
  let db = getInstance();

  let collection = db.collection(INDEX_COLLECTION);

  let data = JSON.parse(readFileSync('../data/index.json'));

  let indexCollection = Object.keys(data).map(menuItem => {
    let ids = Array.from(new Set(data[menuItem]))
    return {
      word: menuItem,
      ids: ids
    }
  });

  writeFileSync('../data/bagowords.json', JSON.stringify(Object.keys(data)));
  // await collection.insertMany(indexCollection);
}



export const importReviewsFromOldCollection = async () => {
  let db = getInstance();
  let collection = db.collection(FOODVISE_COLLECTION);
  let oldRestaurants = db.collection(OLD_RESTAURANT_COLLECTION);

  // console.log(await collection.find({'place_id':{$exists:true}}).count())
  // console.log(await oldRestaurants.find({place_id: {$exists:true}}).count())

  let oldRes = await oldRestaurants.find().toArray();

  oldRes.forEach(or => {
    collection.update({ place_id: or.place_id }, {
      $set: {
        reviews: or.reviews
      }
    })
  })
}

export const importOperatingHoursFromOldCollection = async () => {
  let db = getInstance();
  let collection = db.collection(FOODVISE_COLLECTION);
  let oldRestaurants = db.collection(OLD_RESTAURANT_COLLECTION);

  // console.log(await collection.find({'place_id':{$exists:true}}).count())
  // console.log(await oldRestaurants.find({place_id: {$exists:true}}).count())

  let oldRes = await oldRestaurants.find().toArray();

  oldRes.forEach(or => {
    collection.update({ place_id: or.place_id }, {
      $set: {
        opening_hours: or.opening_hours
      }
    })
  })
}

export const getNonUselessReviews = async () => {
  let db = getInstance();
  let collection = db.collection('reviews');
  let newsfeedposts = db.collection('news_feed_posts');


  // console.log(await collection.find({'place_id':{$exists:true}}).count())
  // console.log(await oldRestaurants.find({place_id: {$exists:true}}).count())

  let oldRev = await collection.find().toArray();
  oldRev = oldRev.filter(r => {
    return r.comment && r.comment.split(" ").length < 10
  });

  let reviews = oldRev.map(r => r._id)

  // await newsfeedposts.remove({post:{$in: reviews}})   ;
  // writeFileSync('../data/newsfeedtodelete.json',JSON.stringify(reviews));  

}

export const insertNewReviews = async () => {
  let db = getInstance();
  let collection = db.collection(FOODVISE_COLLECTION);
  let newReviews = db.collection('newreviews');
  let currentRestaurants = await collection.find().map(r => r.place_id).toArray();

  currentRestaurants.forEach(r => {
    Axios.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${r}&key=AIzaSyCE_0dfZPl-a5Y9F603mEVR9N2tfeBvpxc&fields=name,rating,formatted_phone_number,rating,review,user_ratings_total`)
      .then(async (res) => {
        await newReviews.insert({
          ...res.data.result
        })
      })
  })

}