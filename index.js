import express from 'express';
import { PORT } from './constants';
import { connectToServer, getInstance as getDBInstance } from './database';
import { rootRouter } from './routes';
import Axios from 'axios';
import {
  insertIntoDB,
  getRestaurantsWithMenu,
  importData,
  compareData,
  saveFoodviseRestaurantsToJson,
  comparepeekabu,
  getIndexedData,
  createIndexedCollection,
  importReviewsFromOldCollection,
  importOperatingHoursFromOldCollection,
  getNonUselessReviews,
  insertNewReviews
} from './database/peekabu';
var bodyParser = require('body-parser');
var fs = require('fs');


var app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'content-type');
  next();
});

(async function connect() {
  await connectToServer();

  app.use(rootRouter)
  app.listen(PORT);
  console.log(`app listening on port ${PORT}`);


  let headers = {};
  headers['authorization'] = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6NzIsInJvbGUiOiJndWVzdCIsImlhdCI6MTU1MzcwMDgwNiwianRpIjoiUEpJMXFTb2ktQzRBZFJWcm9nb3RNV2UzV3VXcFdXTm0ifQ.2mb26xL4Qt7FfBQZ-XQvp-fhecMpaVUVXWp_GEST_6U";

  let offset = 0;
  let limit = 100;
  let count = 0;
  // function getRestaurants(offset, limit) {
  //   console.log(offset, limit);
  //   Axios.post('https://peekaboo.guru/api/v5/entities', {
  //     "targetEntities": "_all",
  //     "city": "Karachi",
  //     "country": "Pakistan",
  //     "lat": 24.861462,
  //     "long": 67.009939,
  //     "language": "en",
  //     "categoryId": "1",
  //     "category": "food",
  //     "offset": offset,
  //     "limit": limit,
  //     "sourceEntityId": "_all",
  //     "atlId": "_all"
  //   }, {
  //     headers: headers
  //   }).then(async res => {
  //     let mappedData = res.data;
  //     await insertIntoDB(mappedData);
  //     if (res.data.length == limit) {
  //       console.log('lenght ' + res.data.length);
  //       getRestaurants(offset + limit, limit);
  //     }
  //   }).catch(err => {
  //     console.log(err.response)
  //   })
  // }

  // getRestaurants(offset, limit);
  // getRestaurantsWithMenu();
  // importData([]);
  // await compareData()
  // await createIndexedCollection();
  // await importReviewsFromOldCollection();
  // await importOperatingHoursFromOldCollection();
  // await getNonUselessReviews();
  // await insertNewReviews();
})()

export default app;




// var CloudmersiveOcrApiClient = require('cloudmersive-ocr-api-client');
// var defaultClient = CloudmersiveOcrApiClient.ApiClient.instance;

// // Configure API key authorization: Apikey
// var Apikey = defaultClient.authentications['Apikey'];
// Apikey.apiKey = '4278e5f6-d965-440f-bebd-59386633bfab';


// var apiInstance = new CloudmersiveOcrApiClient.ImageOcrApi();

// var imageFile = Buffer.from(fs.readFileSync("./images/bunkabaap.jpg").buffer); // File | Image file to perform OCR on.  Common file formats such as PNG, JPEG are supported.

// var opts = { 
//   'language': "ENG", // String | Optional, language of the input document, default is English (ENG).  Possible values are ENG (English), ARA (Arabic), ZHO (Chinese - Simplified), ZHO-HANT (Chinese - Traditional), ASM (Assamese), AFR (Afrikaans), AMH (Amharic), AZE (Azerbaijani), AZE-CYRL (Azerbaijani - Cyrillic), BEL (Belarusian), BEN (Bengali), BOD (Tibetan), BOS (Bosnian), BUL (Bulgarian), CAT (Catalan; Valencian), CEB (Cebuano), CES (Czech), CHR (Cherokee), CYM (Welsh), DAN (Danish), DEU (German), DZO (Dzongkha), ELL (Greek), ENM (Archaic/Middle English), EPO (Esperanto), EST (Estonian), EUS (Basque), FAS (Persian), FIN (Finnish), FRA (French), FRK (Frankish), FRM (Middle-French), GLE (Irish), GLG (Galician), GRC (Ancient Greek), HAT (Hatian), HEB (Hebrew), HIN (Hindi), HRV (Croatian), HUN (Hungarian), IKU (Inuktitut), IND (Indonesian), ISL (Icelandic), ITA (Italian), ITA-OLD (Old - Italian), JAV (Javanese), JPN (Japanese), KAN (Kannada), KAT (Georgian), KAT-OLD (Old-Georgian), KAZ (Kazakh), KHM (Central Khmer), KIR (Kirghiz), KOR (Korean), KUR (Kurdish), LAO (Lao), LAT (Latin), LAV (Latvian), LIT (Lithuanian), MAL (Malayalam), MAR (Marathi), MKD (Macedonian), MLT (Maltese), MSA (Malay), MYA (Burmese), NEP (Nepali), NLD (Dutch), NOR (Norwegian), ORI (Oriya), PAN (Panjabi), POL (Polish), POR (Portuguese), PUS (Pushto), RON (Romanian), RUS (Russian), SAN (Sanskrit), SIN (Sinhala), SLK (Slovak), SLV (Slovenian), SPA (Spanish), SPA-OLD (Old Spanish), SQI (Albanian), SRP (Serbian), SRP-LAT (Latin Serbian), SWA (Swahili), SWE (Swedish), SYR (Syriac), TAM (Tamil), TEL (Telugu), TGK (Tajik), TGL (Tagalog), THA (Thai), TIR (Tigrinya), TUR (Turkish), UIG (Uighur), UKR (Ukrainian), URD (Urdu), UZB (Uzbek), UZB-CYR (Cyrillic Uzbek), VIE (Vietnamese), YID (Yiddish)
// };

// var callback = function(error, data, response) {
//   if (error) {
//     console.error(error);
//   } else {
//     console.log('API called successfully. Returned data: ' + JSON.stringify(data));
//   }
// };
// apiInstance.imageOcrPost(imageFile, opts, callback);