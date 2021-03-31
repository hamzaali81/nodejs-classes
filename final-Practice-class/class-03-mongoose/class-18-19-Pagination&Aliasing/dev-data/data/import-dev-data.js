const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const Tour = require('../../Model/tourModel');

dotenv.config({ path: '../../config.env' });



mongoose
 
    .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
  .then(con => {
    console.log(con.connections);
    console.log('DB is connect successful');
  });

  //READ JSON FILE
  const tours = JSON.parse(fs.readFileSync('../../dev-data/data/tours-simple.json','utf-8'));

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

// node dev-data/data/import-dev-data.js
