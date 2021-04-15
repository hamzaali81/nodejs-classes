const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'})
const app = require('./app');

// console.log(process.env);

const DB = process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD)
// mongoose.connect(process.env.DATABASE_LOCAL, {useNewUrlParser: true, useUnifiedTopology: true}).then((con)=>{
//   console.log(con.connections);
//   console.log('DB connection successful');
// });
mongoose.connect(DB, {useNewUrlParser: true, useUnifiedTopology: true}).then((con)=>{
  console.log(con.connections);
  console.log('DB connection successful');
});



const port = process.env.PORT || 3000;
const server= app.listen(port, () => {
  console.log("Server is ready");
});



process.on('unhandledRejection', (err)=> {
  console.log(err.name, err.message);
  console.log('UNHANDLER REJECTION! Shutting down...');
  server.close(()=>{
    process.exit(1); // 0 for success 1 for uncaught exception
  })
})



process.on('uncaughtException', (err)=> {
  console.log('UNCAUGHT EXCEPTION! Shutting down...');
  console.log(err.name, err.message); 
   console.log(err);
   server.close(()=>{
     process.exit(1);
   })
});


// console.log(x);


















