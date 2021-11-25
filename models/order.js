const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userName :{
    type: String,
    required: true,
  },
    item: {
    type: String,
    required: true,
  },
  prezzo: {
    type: Number,
    required: true,
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = { Order };
