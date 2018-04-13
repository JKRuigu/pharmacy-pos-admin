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
  },
  isDisplayed: {
    type: Boolean,
    default: false
  },
  isPharmacy: {
    type: Boolean,
    default: false,
  },
  isBiashara: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });


module.exports = mongoose.model('Updates', updatesSchema);