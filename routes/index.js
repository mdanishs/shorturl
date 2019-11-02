import { Router } from 'express';
import { createOrGetShortUrl, getFullUrl } from '../database';
import { validURL } from '../utils';
import { getAllPeekabooRestaurants, updatePeekabooRestaurant } from '../database/DataInsertor';

export const rootRouter = Router();

// rootRouter.get('/', (req, res, next) => {
//   res.send("Welcome to the URL shortening service");
// });

// rootRouter.get('/:shorturl', async (req, res, next) => {
//   let shortUrl = req.params.shorturl;
//   let fullurl = await getFullUrl(shortUrl);

//   if (fullurl) {
//     res.send({
//       success: true,
//       url: fullurl
//     })
//   } else {
//     res.status(422)
//       .send({
//         success: false,
//         message: 'Url not found'
//       })
//   }
// });

// rootRouter.post('/', async (req, res, next) => {
//   let url = req.body.url;

//   if (url && validURL(url)) {
//     try {
//       let shortUrl = await createOrGetShortUrl(url);
//       if (shortUrl) {
//         res.send({
//           success: true,
//           url: shortUrl
//         });
//       } else {
//         res.status(500)
//           .send({
//             success: false,
//             message: 'Something went wrong.'
//           });
//       }
//     } catch (error) {
//       res.status(500)
//         .send({
//           success: false,
//           message: 'Something went wrong.'
//         });
//     }
//   } else {
//     res.status(422)
//       .send({
//         success: false,
//         message: 'Invalid url format'
//       });
//   }
// });

rootRouter.get('/restaurants', async (req, res, next) => {
  let restaurants = await getAllPeekabooRestaurants();
  res.send({
    success: true,
    restaurants: restaurants
  })
})

rootRouter.post('/restaurant', async (req, res, next) => {
  let data = req.body.data;
  console.log(data);
  try {
    await updatePeekabooRestaurant(data);
    res.send({
      success: true
    })
  } catch (e) {
    res.status(500).send({
      success: false,
      message: 'Error: ' + e.message
    })
  }
})