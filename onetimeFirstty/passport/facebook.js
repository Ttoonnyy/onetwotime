/**
 * Created by Tyler on 21/09/15.
 */
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../models/user');
var fbConfig = require('../socialConfig');
module.exports = function (passport) {
    passport.use('facebook', new FacebookStrategy({
            clientID: fbConfig.fb.appID,
            clientSecret: fbConfig.fb.appSecret,
            callbackURL: fbConfig.fb.callbackUrl
        },
        // Facebook will send back the tokens and profile
        function (access_token, refresh_token, profile, done) {
            console.log('profile', profile);
            // Asynchronous
            process.nextTick(function () {
                //Find the user in the database based on their facebook id
                User.findOne({'id': profile.id}, function (err, user) {
                    // If there is an error, stop everything and return that
                    // i.e. an error connecting to the database
                    if (err) {
                        return done(err);
                    }
                    // If the user is found, then log them in
                    if (user) {
                        return done(null, user); // User found, return that user
                    } else {
                        // If there is no user found with that facebook id, create them
                        var newUser = new User();
                        // Set all of the facebook information in our user model
                        newUser.fb.id = profile.id; // Set the users facebook id
                        newUser.fb.access_token = access_token; // We will save the token that facebook provides to the user
                        newUser.fb.firstName = profile.name.givenName;
                        newUser.fb.lastName = profile.name.familyName; // Look at the passport user profile to see how names are returned
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