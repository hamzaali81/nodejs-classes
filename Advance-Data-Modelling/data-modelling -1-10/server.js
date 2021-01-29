const app = require('./app');
const dotenv = require('dotenv');
const mongoose = require ('mongoose');


dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

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

// mongoose.connect(DB, 
// {useNewUrlParser: true});

const port = process.env.PORT || 3000;
app.listen(port, () =>{
    console.log(`Server is listen port ${port}`);
})

