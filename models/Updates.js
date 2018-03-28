const mongoose = require('mongoose');

const updatesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  date: {
    type: String
  }
}, { timestamps: true });


module.exports = mongoose.model('Updates', updatesSchema);