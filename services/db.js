const mongoose = require("mongoose");

const startMongoDB = async () => {
  await mongoose.connect("mongodb://localhost:27017/Paninoteka");
  console.log("Mongo connected correctly!");
};

module.exports = { startMongoDB };
