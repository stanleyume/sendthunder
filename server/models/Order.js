const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

const orderSchema = new mongoose.Schema({
  recipient: {
    type: String,
    trim: true,
    required: 'Please enter a Twitter handle'
  },
  thunder_name: {
    type: String,//mongoose.Schema.Types.ObjectId,
    ref: 'Thunder'
  },
  created_at: {
    type: String,
    default: new Date().toISOString()
  },
  meta: {
    id: String,
    timestamp: {
      type: Number,
      default: parseInt((new Date().getTime() / 1000).toFixed(0))
    }
  }
});

module.exports = mongoose.model('Order', orderSchema);