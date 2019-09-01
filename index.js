import express from 'express';
import { PORT } from './constants';
import { connectToServer, getInstance as getDBInstance } from './database';
import { rootRouter } from './routes';
var bodyParser = require('body-parser');

var app = express();
app.use(express.json());

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'content-type');
  next();
});

connectToServer();
app.use(rootRouter)
app.listen(PORT);
console.log(`app listening on port ${PORT}`);
export default app;