var TwitterStrategy  = require('passport-twitter').Strategy;
var User = require('../models/user');
var twitterConfig = require('../socialConfig');
module.exports = function(passport) {
    passport.use('twitter', new TwitterStrategy({
            consumerKey     : twitterConfig.twitter.apikey,
            consumerSecret  : twitterConfig.twitter.apisecret,
            callbackURL     : twitterConfig.twitter.callbackURL
        },
        function(token, tokenSecret, profile, done) {
            // make the code asynchronous
            // User.findOne won't fire until we have all our data back from Twitter
            process.nextTick(function() {
                User.findOne({ 'twitter.id' : profile.id }, function(err, user) {
                    // if there is an error, stop everything and return that
                    // ie an error connecting to the database
                    if (err)
                        return done(err);
                    // if the user is found then log them in
                    if (user) {
                        return done(null, user); // user found, return that user
                    } else {
                        // if there is no user, create them
                        var newUser                 = new User();
                        // set all of the user data that we need
                        newUser.twitter.id = profile.id;
                        newUser.twitter.token = token;
                        newUser.twitter.username = profile.username;
                        newUser.twitter.displayName = profile.displayName;
                        //newUser.twitter.lastStatus = profile._json.status.text;
                        // save our user into the database
                        newUser.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });
            });
        }));
};