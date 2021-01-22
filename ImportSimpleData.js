// This File is for Importing the Data in the Databasae through Files
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Tour = require('./models/tourModel');

// Parsing The Data in the JSON Form
const data = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// Setting up the Database Environment
dotenv.config({ path: `${__dirname}/config.env` });
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.PASSWORD);

// Connect to the Database
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

// Importing the Data in the Database
const Import = async () => {
  try {
    await Tour.create(data);
    console.log('Data Imported Successfully');
  } catch (err) {
    console.log(err.message);
  }
  process.exit();
};

// Dropping the Complete
const Delete = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data Deleted Successfully');
  } catch (err) {
    console.log(err.message);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  Import();
} else if (process.argv[2] === '--delete') {
  Delete();
}
