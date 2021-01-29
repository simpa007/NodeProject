// GET to retrieve a resource;
// PUT to change the state of or update a resource, which can be an object, file or block;
// POST to create that resource; and
// DELETE to remove it.

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// User model
const User = require('../models/User');

//Login
router.get('/login', (req, res) => {
    res.render('Login');
});

//Register
router.get('/register', (req, res) => { 
    res.render('register');
})

//Register Handle
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
    let errors = [];

//check required fields
    if (!name || !email || !password || !password2) { 
        errors.push({ msg: 'please fill in all fields' });
    }
//check passwords match
    if (password !== password2) { 
        errors.push({ msg: 'password mismatch' });
    }
//check passwords length
    if (password < 6) { 
        errors.push({ msg: 'password should be  at least 6 characters' });
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    }
    else { 
        //res.send('pass');
    // Validation passed 
        User.findOne({ email: email })
            .then(user => {
                if (user) {
                    //user exists
                    errors.push({msg: 'Email is already registered'})
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    });
                }
                else { 
                    const newUser = new User({
                        name,
                        email,
                        password
                    });


                    // Hash Password
                    bcrypt.genSalt(10, (err, salt) =>
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        //set password to hashed
                        newUser.password = hash;
                        //Save user
                        newUser.save()
                            .then((user) => {
                                req.flash('success_msg', 'You are now registered and can login');
                                res.redirect('/users/login');
                            })
                            .catch((err) => console.error('error occured', err));
                    }))
                }

             });
    }
})

//Login Handle
router.post('/login', (req,res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

//Logout Handle
router.get('/logout', (req,res) => { 
    req.logout();
    req.flash('success_msg', 'you are logged out');
    res.redirect('/users/login');
})

module.exports = router;
