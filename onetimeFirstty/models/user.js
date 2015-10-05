var mongoose = require('mongoose');
module.exports = mongoose.model('User', {
    fb: {
        id: String,
        access_token: String,
        firstName: String,
        lastName: String
    },
    twitter: {
        id: String,
        token: String,
        username: String,
        displayName: String,
        lastStatus: String
    },
    google: {
        id: String,
        token: String,
        email: String,
        name: String
    },
    local: {
        id: String,
        username: String,
        password: String,
        email: String,
        firstName: String,
        lastName: String
    }
});