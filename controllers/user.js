//User controlle handles routes for user functions

const express = require('express');
const router = express.Router();
const User = require('../models/user')

//Creates a new user and redirects to root
router.post('/', (req, res) => {
    var user = new User(req.body);
    user.save(error => {
        if (error) res.json({ message: error })
        else {
            req.session.user = user
            res.redirect('/');
        }
    });
});

//Handles user login
router.post('/login', (req, res) => {
    User.findOne({ 'username': req.body.username }, (error, user) => {
        if (error) console.log(error)
        else if (user) {
            user.checkPassword(req.body.password, (error, match) => {
                if (error) console.log(error)
                if (match) {
                    req.session.user = user;
                    res.redirect('/')
                } else {
                    res.flash('info', 'username or password where incorrect' );
                    res.render('index.ejs');
                }
            });
        } else {
            res.flash('info', 'username or password where incorrect' );
            res.flash('info', 'username or password where incorrect' );
            res.redirect('/');
        }
    });
});

//Handles user logout
router.get('/logout', (req, res) => {
    req.session.destroy((error) => {
        if (error) console.log('error')
        else res.redirect('/')
    })
});

//Get user, returns user info as json
router.get('/:username', (req, res) => {
    User.findOne({ 'username': req.params.username }, 'username', (error, user) => {
        if (error) res.json({ message: error })
        else {
            res.json(user);
        }
    });
});

module.exports = router