var mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  category:{
    type: String,
    required: true
  },
  content: {
    type: [Object],
    required: false
  },
  photo: {
    type: String,
    require: false
  },
  metadsc: {
    type: String,
    required: false
  },
  author: {
    type: String,
    required: false
  },
  date: {
    type: Date,
    default: Date.now
  },
  URL: {
    type: String,
    required: false
  },
  comment: [Object],
  star: {
    type: Number,
    default: 0
  },
  rateNum: {
    type: Number,
    default: 0
  },
  view: {
    type: Number,
    default: 0
  }
});

const Content = mongoose.model('Content', contentSchema);

module.exports = Content;
