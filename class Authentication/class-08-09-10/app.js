const express = require('express');
const app = express();
const bodyParser = require('body-parser');
// var cookieParser = require('cookie-parser')
// var cookieValidator = require('./cookieValidator')
const morgan = require('morgan')

app.use(morgan('dev'));
app.use(morgan('tiny'));
app.use(express.static('./dev-data/data'))

// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log('Hello from the middleware 👋');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.headers);
  next();
});


app.param('id',(req, res,next,val)=>{
    console.log('id',val);
    next();
})
const tourRoutes = require('./routes/tourRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/v1/tours',tourRoutes);
app.use('/api/v1/users', userRoutes);

module.exports = app;




