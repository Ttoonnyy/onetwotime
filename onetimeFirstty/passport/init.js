var login = require('./login');
var signup = require('./signup');
var facebook = require('./facebook');
var twitter = require('./twitter');
var google = require('./google');
var User = require('../models/user');
module.exports = function(passport) {
    // Passport needs to be able to serialize and deserialize users to support persistant login sessions
    //Serializing and Deserializing User Instances
    passport.serializeUser(function(user, done) {
        console.log('serializing user: ', user);
        done(null, user._id);
    });
    passport.deserializeUser(function(id, done){
        User.findById(id, function(err, user) {
            console.log('deserializing user: ', user);
            done(err, user);
        });
    });
    //Setting up Passport Strategies for Login, SignUp/Registration and Facebook
    login(passport);
    signup(passport);
    facebook(passport);
    twitter(passport);
    google(passport);
}