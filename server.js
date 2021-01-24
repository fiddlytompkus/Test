const http = require('http');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { static } = require('express');

dotenv.config({ path: `${__dirname}/config.env` });
const app = require(`${__dirname}/app.js`);

app.set('view engine', 'ejs');

const DB = process.env.DATABASE.replace('<password>', process.env.PASSWORD);
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

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
