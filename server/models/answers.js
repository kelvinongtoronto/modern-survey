let mongoose = require('mongoose');

// create a model class
let Answers = mongoose.Schema({
    Survey: String,
    Answers: [String],
    SubmitDate: Date
},
{
    collection: "answers"
});

module.exports = mongoose.model('Answers', Answers);
