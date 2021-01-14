const mongoose = require('mongoose');
const tourSchema = new mongoose.Schema({ 
   name : {
       type: String,
       unique: true,
       required: [true, 'Must be required name'],
       default: 'Unknown user'

   },
   price: {
       type: Number
   },
   rating: {
       type: Number
   }
   
});

const Tour = mongoose.model('Tour',tourSchema);
module.exports = Tour;