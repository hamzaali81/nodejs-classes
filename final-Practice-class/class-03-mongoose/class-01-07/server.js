import mongoose from 'mongoose';
const dotenv = require('dotenv');
dotenv.config({path: './config.env'})
const app = require('./app');


// console.log(app.get('env'));

console.log(process.env);

const tourSchema = new mongoose.Schema({
    // name: String,
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true
    },
    rating: {
      type: Number,
      default: 4.5
    },
    // price: Number
    price: {
      type: Number,
      // required: true
      required: [true, 'A tour must have a price']
    }
});

// const Tour = mongoose.model(Model name, schema)
const Tour = mongoose.model('Tour', tourSchema)

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server is ready");
});