const express = require('express');
const userRouter = require(`${__dirname}/routes/userRoutes`);
const viewRouter = require(`${__dirname}/routes/viewRoutes`);
const AppError = require('./utils/appError');
const globalErrorHandler = require('./Controller/errorController');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
//routes
// app.use('/', viewRouter);
app.use('/v1/users/', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this Server`, 404));
});

// Error Handling Middleware
app.use(globalErrorHandler);

module.exports = app;
