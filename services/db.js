const mongoose = require("mongoose");

const startMongoDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Mongo connected correctly!");
};

module.exports = { startMongoDB };
