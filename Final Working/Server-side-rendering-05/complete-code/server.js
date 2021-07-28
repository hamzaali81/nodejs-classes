const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException',(err)=> {
  console.log(err.name, err.message);
  console.log('Uncaught Exception');
  console.log(err);
  process.exit(1);
  // server.close(()=> {
  // })
})

const app = require('./app');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD)
// const DB = process.env.DATABASE_LOCAL;
mongoose.connect(DB, {useNewUrlParser: true, useUnifiedTopology: true})
.then((con)=> {
  //  console.log(con.connections);
   console.log('Successful connection');
}).catch((err)=> console.log('Error',err));

const port = process.env.PORT || 6000;
const server=app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});


//Unhandled Rejection
process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! Shutting down');
  server.close(()=> {
    process.exit(1);  //end the app crashed mood
  });
});


// caughting uncaught exception
// console.log(x);

// process.on('uncaughtException',(err)=> {
//   console.log(err.name, err.message);
//   console.log('Uncaught Exception');
//   console.log(err);
//   server.close(()=> {
//     process.exit(1);
//   })
// })
// console.log(x);