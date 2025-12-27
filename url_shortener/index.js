const express = require("express");
const app = express();
const PORT = 8000;

const urlRoute = require('./routes/url');
const URL = require('./models/url');
const { connectToMongoDB } = require('./connection');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectToMongoDB('mongodb://127.0.0.1:27017/short_url')
  .then(() => console.log('MongoDB connected'));

app.use('/url', urlRoute);

app.listen(PORT, () => console.log(`Server Started at ${PORT}`));
