let mongoose = require('mongoose');

// create a model class
let Survey = mongoose.Schema({
    Title: String,
    Owner: String,
    Questions: [String],
    Active: Boolean,
    StartDate: Date,
    EndDate : Date
},
{
    collection: "surveys"
});

module.exports = mongoose.model('Survey', Survey);
