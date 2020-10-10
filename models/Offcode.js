var mongoose = require('mongoose');
const { bool } = require('sharp');

var OffcodeSchema = new mongoose.Schema({
    code: String,
    startDate: Date,
    endDate: Date,
    percent: Number,
    type: String,
    userList: [Object],
    price: Number,
    ispercent: Boolean,
    description: String
});

var Offcode = mongoose.model('Offcode', OffcodeSchema);

module.exports = Offcode;
