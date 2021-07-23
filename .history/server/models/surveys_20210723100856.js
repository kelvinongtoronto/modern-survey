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

let Question = mongoose.Schema({
    Question: String,
    Answers: [String]
},
{
    collection: "questions"
});

module.exports = mongoose.model('Survey', Survey);
