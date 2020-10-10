var mongoose = require('mongoose');

var PaymentSchema = new mongoose.Schema({
    fullname: String,
    username: String,
    phone: Number,
    amount: Number,
    description: String,
    date: Date,
    payDate: Date,
    payed: {
      type: Boolean,
      default: false
    },
    track_id: String
  });

var Payment = mongoose.model('Payment', PaymentSchema);

module.exports = Payment;
