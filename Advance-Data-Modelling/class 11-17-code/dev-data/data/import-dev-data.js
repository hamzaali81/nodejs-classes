const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const Tour = require('../../models/tourModel');

dotenv.config({ path: '../../config.env' });



// mongoose
 
//     .connect(process.env.DATABASE, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false,
//     useCreateIndex: true
//   })
//   .then(con => {
//     console.log(con.connections);
//     console.log('DB is connect successful');
//   });

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
  autoIndex: false, // Don't build indexes
  poolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4 // Use IPv4, skip trying IPv6
};
mongoose.connect(process.env.DATABASE, options).then(()=> console.log('DB connection successful'));
  //READ JSON FILE
  const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`,'utf-8'));

  //IMPORT DATA INTO DB
  const importData = async (req, res)=>{
      try {
          await Tour.create(tours)
          console.log('Data is successfully loaded!');
        }
        catch (err){

        }
        process.exit();
  }
  //DELETE ALL DATA INTO DB

  const deleteData = async (req, res)=>{
    try {
        await Tour.deleteMany()
        console.log('Data is successfully deleted!');
      }
      catch (err){
     console.log(err);
      }
      process.exit();
}

console.log(process.argv);
console.log(process.argv0);

if(process.argv[2] === '--import'){
importData();
}
else if(process.argv[2] === '--delete'){
deleteData();
}

