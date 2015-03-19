'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
    url = require('url'),
    FacebookStrategy = require('passport-facebook').Strategy,
    config = require('../config'),
    users = require(__base + 'app/backend/modules/users/controllers/index');

module.exports = function () {
    // Use facebook strategy
    passport.use(new FacebookStrategy({
            clientID: config.facebook.clientID,
            clientSecret: config.facebook.clientSecret,
            callbackURL: config.facebook.callbackURL,
            passReqToCallback: true
        },
        function (req, accessToken, refreshToken, profile, done) {
            // Set the provider data and include tokens
            var providerData = profile._json;
            providerData.accessToken = accessToken;
            providerData.refreshToken = refreshToken;
            console.log('^^^^^^^', profile);
            // Create the user OAuth profile
            var providerUserProfile = {
                id: providerData.id,
                user_url: providerData.link,
                user_email: providerData.email,
                user_login: providerData.name,
                display_name: providerData.name,
                role_id: 5,
                user_image_url: 'https://graph.facebook.com/' + providerData.id + '/picture?width=200&height=200&access_token=' + providerData.accessToken,
                user_status: 'publish'
            };

            // Save the user OAuth profile
            users.saveOAuthUserProfile(req, providerUserProfile, function(err, user){
                console.log('111111111111');
                done(err, user);
            });
        }
    ));
};