const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let thunderSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: 'The title of the Thunder is required'
  },
  
});

module.exports = mongoose.model('Thunder', thunderSchema);