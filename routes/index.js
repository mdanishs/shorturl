import { Router } from 'express';
import { insertLongUrl } from '../database';
import { validURL, toBase62 } from '../utils';

export const rootRouter = Router();

rootRouter.get('/', (req, res, next) => {
  res.send("Welcome to the URL shortening service");
});

rootRouter.post('/', async (req, res, next) => {
  let url = req.body.url;
  if (url && validURL(url)) {
    let count = await insertLongUrl(url);
    let shortUrl = toBase62(count);
    res.send({
      success: true,
      url: shortUrl
    })
  } else {
    res.status(422)
      .send({
        success: false,
        message: 'Invalid url format'
      });
  }
});