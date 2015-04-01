'use strict';

/**
 * Module dependencies.
 */
let passport = require('passport'),
	url = require('url'),
	GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
	config = require('../config'),
    users = require(__base + 'app/backend/modules/users/controllers/index');

module.exports = function() {
	// Use google strategy
	passport.use(new GoogleStrategy({
			clientID: config.google.clientID,
			clientSecret: config.google.clientSecret,
			callbackURL: config.google.callbackURL,
			passReqToCallback: true
		},
		function(req, accessToken, refreshToken, profile, done) {
			// Set the provider data and include tokens
			let providerData = profile._json;
			providerData.accessToken = accessToken;
			providerData.refreshToken = refreshToken;

			// Create the user OAuth profile
			let providerUserProfile = {
				firstName: profile.name.givenName,
				lastName: profile.name.familyName,
				displayName: profile.displayName,
				email: profile.emails[0].value,
				username: profile.username,
				provider: 'google',
				providerIdentifierField: 'id',
				providerData: providerData
			};

			// Save the user OAuth profile
			users.saveOAuthUserProfile(req, providerUserProfile, done);
		}
	));
};