var mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  fullname: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    require: true
  },
  role: {
    type: String,
    enum: ['user', 'translator', 'contentor', 'admin'],
    default: 'user'
  },
  destLangs: [String],
  baseLangs: [String],
  day: Number,
  month: Number,
  year: Number,
  passNumber: String,
  phoneback: String,
  creditNum: String,
  sex: String,
  confirmed: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    required: true
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  },
  newsLetter: {
    type: Boolean,
    default: false,
    required: true
  },
  code:{
    type: String,
    required: false
  },
  applied: {
    type: Boolean,
    default: false
  },
  agreement: Object,
  idCard: Object,
  firstEnter: {
    type: Boolean,
    default: true
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
