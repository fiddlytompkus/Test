const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const userRouter = require('./routes/userRoutes');
const app = express();

dotenv.config({ path: `${__dirname}/config.env` });
const DB = process.env.DATABASE.replace('<password>', process.env.PASSWORD);
// console.log(DB);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Database Successfully Connected');
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.json());
app.use('/', userRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
