var mongoose = require('mongoose');
const { text } = require('express');

var ticketSchema = new mongoose.Schema({
    emial: String,
    fullname: String,
    username: String,
    phone: Number,
    text: String,
    file: String,
    date: {
        type: Date,
        default: Date.now()
    },
    answers: [Object],
    subject: String,
    readBy: [Object],
    state: {
        type: String,
        default: 'در حال انتظار'
    }
});

var Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
