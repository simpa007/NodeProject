const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();

//passport config
require('./config/passport')(passport);

//DB Config
const db = require('./config/key').mongoURI;
//connect to Mongo
mongoose.connect(db, {useNewUrlParser: true,  useUnifiedTopology: true})
    .then(() => console.log('Database Connected Successfully..'))
    .catch(err => console.error('Database connection unsuccessful', err));

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//take note the bodyparser should come before the routes
//Bodyparser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// Express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
//it important where you put it
//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect flash
app.use(flash());

//Global Vars custom middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();

});


// Routes
app.use('/', require('./router/index'));
app.use('/users', require('./router/users'));









const PORT = process.env.PORT || 2000;

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});