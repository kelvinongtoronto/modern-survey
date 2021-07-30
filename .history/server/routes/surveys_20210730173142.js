/* surveys.js
 * Kelvin Ong
 * 301178688
 * Project - surveys site
 * June 25, 2021
 */

// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let moment = require('moment');

// define the survey model
let survey = require('../models/surveys');
let question = 
/* GET surveys List page. READ */
router.get('/', (req, res, next) => {
    // find all surveys in the surveys collection
    survey.find( (err, surveys) => {
        if (err) {
            return console.error(err);
        } else {
            res.render('surveys/index', {  
                title: 'Surveys',
                surveys: surveys,
                displayName: req.user ? req.user.displayName : '',
                moment: moment
            });
        }
    });
});

//  GET the Survey Details page in order to add a new Survey
router.get('/add', (req, res, next) => {
    res.render('surveys/new', {
        title: 'Add Survey',
        surveys: {},
        displayName: req.user ? req.user.displayName : '',
        moment: moment
    })
});

// POST process the Survey Details page and create a new Survey - CREATE
router.post('/add', (req, res, next) => {
    let newSurvey = survey({
        "Title": req.body.title,
        "Owner": req.body.owner,
        "Questions": req.body.questions.trim().split("\n"),
        "Active": req.body.active ? true : false,
        "StartDate": req.body.startdate,
        "EndDate": req.body.enddate
    });

    survey.create(newSurvey, (err, survey) =>{
        if(err) {
            console.log(err);
            res.end(err);
        } else {
            // refresh the survey list
            res.redirect('/surveys');
        }
    });
});

// GET the Survey Details page in order to edit an existing Survey
router.get('/edit/:id', (req, res, next) => {
    let id = req.params.id;

    survey.findById(id, (err, surveyToEdit) => {
        if(err) {
            console.log(err);
            res.end(err);
        } else {
            //show the edit view
            res.render('surveys/details', {
                title: 'Edit Survey', 
                surveys: surveyToEdit,
                displayName: req.user ? req.user.displayName : '',
                moment: moment
            })
        }
    });
});

// POST - process the information passed from the details form and update the document
router.post('/edit/:id', (req, res, next) => {
    let id = req.params.id

    let updatedSurvey = survey({
        "_id": id,
        "Title": req.body.title,
        "Owner": req.body.owner,
        "Questions": req.body.questions.trim().split("\n"),
        "Active": req.body.active ? true : false,
        "StartDate": req.body.startdate,
        "EndDate": req.body.enddate
    });

    survey.updateOne({_id: id}, updatedSurvey, (err) => {
        if(err) {
            console.log(err);
            res.end(err);
        } else {
            // refresh the survey list
            res.redirect('/surveys');
        }
    });
});

// GET - process the delete by user id
router.get('/delete/:id', (req, res, next) => {
    let id = req.params.id;

    survey.remove({_id: id}, (err) => {
        if(err) {
            console.log(err);
            res.end(err);
        } else {
            // refresh the survey list
            res.redirect('/surveys');
        }
    });
});

// GET - view the Survey
router.get('/:id', (req, res, next) => {
    let id = req.params.id;

    survey.findById(id, (err, surveyToView) => {
        if(err) {
            console.log(err);
            res.end(err);
        } else {
            res.render('surveys/view', {
                title: 'Survey',
                surveys: surveyToView,
                displayName: req.user ? req.user.displayName : ''
            })
        }
    });
});

// POST - submit the Survey
router.post('/:id', (req, res, next) => {});

module.exports = router;