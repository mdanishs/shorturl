import express from 'express';
import { PORT } from './constants';
import { connectToServer, getInstance as getDBInstance } from './database';
import { rootRouter } from './routes';
var bodyParser = require('body-parser');


var app = express();
app.use(express.json());

connectToServer((err) => {
  if(!err){
    console.log('connected to database');
    
    app.use(rootRouter)
  
    app.listen(PORT, () => {
      console.log(`app listening on port ${PORT}`);
    })
  }else{
    console.error('Connection Failed: ' + err);
  }
})
