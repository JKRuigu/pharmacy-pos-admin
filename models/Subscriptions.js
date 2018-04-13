const mongoose = require('mongoose');

const updatesSchema = new mongoose.Schema({
  item: {
    type: String,
    required: true
  },
  quantity: {
    type: String,
    required: true
  },
  amount: {
    type: String,
    required: true
  },
  date: {
    type: String
  },
  status: {
    type: Number,
    default: 0
  },
  customerId: {
    type: String
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


module.exports = mongoose.model('Subscriptions', updatesSchema);