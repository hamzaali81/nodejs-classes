const dotenv = require('dotenv');
const app = require('./app');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD)
mongoose.connect(DB, {useNewUrlParser: true})
.then((con)=> {
  //  console.log(con.connections);
   console.log('Successful connection');
});

const port = process.env.PORT || 6000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
