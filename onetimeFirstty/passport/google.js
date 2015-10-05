var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('../models/user');
var googleConfig = require('../socialConfig');
module.exports = function (passport) {
    passport.use('google', new GoogleStrategy({
            clientID: googleConfig.google.clientID,
            clientSecret: googleConfig.google.clientSecret,
            callbackURL: googleConfig.google.callbackURL
        },
        function (token, refreshToken, profile, done) {
            // make the code asynchronous
            // User.findOne won't fire until we have all our data back from Google
            process.nextTick(function () {
                // try to find the user based on their google id
                User.findOne({'google.id': profile.id}, function (err, user) {
                    if (err) {
                        return done(err);
                    }
                    if (user) {
                        // if a user is found, log them in
                        return done(null, user);
                    } else {
                        // if the user isnt in our database, create a new user
                        var newUser = new User();
                        // set all of the relevant information
                        newUser.google.id = profile.id;
                        newUser.google.token = token;
                        newUser.google.name = profile.displayName;
                        newUser.google.email = profile.emails[0].value; // pull the first email
                        // Save our user to the database
                        newUser.save(function (err) {
                            if (err) {
                                throw err;
                            }
                            // If successful, return the new user
                            return done(null, newUser);
                        });
                    }
                });
            });
        }));
}