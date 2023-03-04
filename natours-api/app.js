const express = require('express');
const morgan = require('morgan');
const app = express();

const AppError = require('./utils/appError');
const userRouter = require('./routes/userRoutes');
const tourRouter = require('./routes/tourRoutes');
const globalErrorHandler = require('./controllers/errorController');

// app.use(express.json());
if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server`,
  // });

  // const err = new Error(`Can't find ${req.originalUrl} on this server`);

  // err.statusCode = 404;
  // err.status = 'fail';

  // next(err);

  next(new AppError(`Can't find ${req.originalUrl} on this server`), 404);
});

app.use(globalErrorHandler);

module.exports = app;
