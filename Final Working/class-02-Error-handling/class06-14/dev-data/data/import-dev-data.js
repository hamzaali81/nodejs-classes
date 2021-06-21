const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Tour = require("../../models/tourModel");

dotenv.config({ path: "../../config.env" });

const DB =
  "mongodb+srv://hamzaali:HVQRumv4BZ5Axf3Q@cluster0.zeosx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose.connect(DB, { useNewUrlParser: true }).then((con) => {
//   console.log(con.connections);
  console.log("Successful connection");
});

// READ JSON FILE
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, "utf8")
);

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log("Data Successfully loaded");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log("Data Successfully deleted");
} catch (err) {
    console.log(err);
}
process.exit();
};

// console.log(process.argv);

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}


// node dev-data/data/import-dev-data.js --import