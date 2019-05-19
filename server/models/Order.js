const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

const orderSchema = new mongoose.Schema({
  recipient: {
    type: String,
    trim: true,
    required: 'Please enter a Twitter handle'
  },
  thunder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Thunder'
  }
});

module.exports = mongoose.model('Order', orderSchema);