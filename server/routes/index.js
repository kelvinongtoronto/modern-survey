// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let passport = require('passport');

// define the survey model
//let survey = require('../models/surveys');

// enable jwt
let jwt = require('jsonwebtoken');
let DB = require('../config/db');

// create the User Model instance
let userModel = require('../models/user');
let User = userModel.User;

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('content/index', {
        title: 'Home',
        surveys: '',
        displayName: req.user ? req.user.displayName : ''
    });
});

/* GET thank you page. */
router.get('/thankyou', (req, res, next) => {
    res.render('content/thankyou', {
        title: 'Thank You',
        surveys: '',
        displayName: req.user ? req.user.displayName : ''
    });
});

/* GET Route for displaying the Login page */
router.get('/login', (req, res, next) => {
    if(!req.user)
    {
        res.render('auth/login', 
        {
          title: "Login",
          messages: req.flash('loginMessage'),
          displayName: req.user ? req.user.displayName : '' 
        })
    }
    else
    {
        return res.redirect('/');
    }
});

/* POST Route for processing the Login page */
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        // server err?
        if(err)
        {
            return next(err);
        }
        // is there a user login error?
        if(!user)
        {
            req.flash('loginMessage', 'Authentication Error');
            return res.redirect('/login');
        }
        req.login(user, (err) => {
            // server error?
            if(err)
            {
                return next(err);
            }

            const payload = 
            {
                id: user._id,
                displayName: user.displayName,
                username: user.username,
                email: user.email
            }

            const authToken = jwt.sign(payload, DB.Secret, {
                expiresIn: 604800 // 1 week
            });
            return res.redirect('/surveys');
        });
    })(req, res, next);
});

/* GET Route for displaying the Register page */
router.get('/register', (req, res, next) => {
    if(!req.user)
    {
        res.render('auth/register',
        {
            title: 'Register',
            messages: req.flash('registerMessage'),
            displayName: req.user ? req.user.displayName : ''
        });
    }
    else
    {
        return res.redirect('/');
    }
});

/* POST Route for processing the Register page */
router.post('/register', (req, res, next) => {
    let newUser = new User({
        username: req.body.username,
        email: req.body.email,
        displayName: req.body.displayName
    });

    User.register(newUser, req.body.password, (err) => {
        if(err)
        {
            console.log("Error: Inserting New User");
            if(err.name == "UserExistsError")
            {
                req.flash(
                    'registerMessage',
                    'Registration Error: User Already Exists!'
                );
                console.log('Error: User Already Exists!')
            }
            return res.render('auth/register',
            {
                title: 'Register',
                messages: req.flash('registerMessage'),
                displayName: req.user ? req.user.displayName : ''
            });
        }
        else
        {
            return passport.authenticate('local')(req, res, () => {
                res.redirect('/surveys')
            });
        }
    });
});

/* GET to perform UserLogout */
router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/');
});


module.exports = router;
