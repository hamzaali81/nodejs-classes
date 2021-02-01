const express = require('express');

const app = express();
const bodyParser = require('body-parser');
// var cookieParser = require('cookie-parser')
// var cookieValidator = require('./cookieValidator')
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require("helmet");
const mongoSanitize = require('express-mongo-sanitize');
var xss = require('xss-clean')
var hpp = require('hpp');
const reviewRoutes = require('./routes/reviewRoutes');

app.use(morgan('dev'));
app.use(morgan('tiny'));
app.use(express.static('./dev-data/data'))

// 1)Global MIDDLEWARES
//Security Http headers
app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
// app.set('trust proxy', 1);
 
//Limit request from save api
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 2, // limit each IP to 100 requests per windowMs //3 req
  message: 'To many request from this IP address, Please try again an hour!'
});

//  apply to all requests
app.use('/api',limiter);
 
// Body parser, reading data into req.body
app.use(express.json({limit: '10kb' }));

//Data sanitization against NoSQL query injection
// To remove data, use:

app.use(mongoSanitize());
//Data sanitization against xss
app.use(xss());
//Prevent paramete for pollution
app.use(hpp({
whitelist: [
  'duration', 'ratingsQuery'
] 
})); // <- THIS IS THE NEW LINE
app.use(bodyParser.urlencoded({ extended: false }))

//Serving static files
app.use(express.static(`${__dirname}/public`));

//Test middlewares 
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
app.use('/api/v1/reviews',reviewRoutes); 

module.exports = app;




