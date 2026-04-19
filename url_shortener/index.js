  const express = require("express");
  const app = express();
  const PORT = 8000;
  const cookieParser = require('cookie-parser');
  const {
    checkForAuthentication,
    restrictTo
  }= require('./middlewares/auth');

  const path= require('path');
  const urlRoute = require('./routes/url');
  const staticRoute= require('./routes/staticRouter');
  const userRoute = require('./routes/user');
  const URL = require('./models/url');
  const { connectToMongoDB } = require('./connection');

  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(checkForAuthentication);
  connectToMongoDB('mongodb://127.0.0.1:27017/short_url')
    .then(() => console.log('MongoDB connected'));

  app.set('view engine','ejs');
  app.set('views',path.resolve('./views'));

  app.use('/url',restrictTo(["NORMAL"]), urlRoute);
  app.use('/',staticRoute);
  app.use('/user',userRoute);

  app.listen(PORT, () => console.log(`Server Started at ${PORT}`));
