const express = require('express');
const userRouter = require(`${__dirname}/routes/userRoutes`);

const app = express();

app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use('/v1/users/', userRouter);

module.exports = app;
