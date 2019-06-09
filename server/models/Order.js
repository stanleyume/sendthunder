const mongoose = require('mongoose');
const moment = require('moment');
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
    default: () => { return new Date().toISOString() }
  },
  meta: {
    id: String,
    timestamp: {
      type: Number,
      default: () => { return parseInt((new Date().getTime() / 1000).toFixed(0)) }
    }
  }
});

orderSchema.statics.sentToday = async function () {
    // Get orders sent today
    const today = moment().startOf('day');
    // This shit don't work on Atlas
    // const orders_today = await this.find({ '$where': 'this.created_at.slice(0, 10) == new Date().toISOString().slice(0, 10)' }).sort({ 'meta.timestamp': -1 });
    const orders_today = await this.find({
      created_at: {
        $gte: today.toISOString(),
        $lte: moment(today).endOf('day').toISOString()
      }
    }).sort({ 'meta.timestamp': -1 });
    return orders_today;
}

module.exports = mongoose.model('Order', orderSchema);