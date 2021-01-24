const express = require('express');
const userRouter = require(`${__dirname}/routes/userRoutes`);
const AppError = require('./utils/appError');
const globalErrorHandler = require('./Controller/errorController');

const app = express();

app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use('/v1/users/', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this Server`, 404));
});

// Error Handling Middleware
app.use(globalErrorHandler);

module.exports = app;
