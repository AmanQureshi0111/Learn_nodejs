const express = require("express");
const { connectMongoDb } = require('./connection');
const { logReqRes } = require('./middleware');
const userRouter = require('./routes/user');

const app = express();
const port = 8000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(logReqRes('log.txt'));
app.use('/api/users', userRouter);

connectMongoDb('mongodb://127.0.0.1:27017/my_db')
  .then(() => {
      console.log("MongoDB connected");
  });

app.listen(port, () => { console.log(`Server listening at ${port}`);});
