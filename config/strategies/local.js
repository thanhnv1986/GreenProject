'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy;

module.exports = function() {
	// Use local strategy
	passport.use(new LocalStrategy({
			usernameField: 'username',
			passwordField: 'password'
		},
		function(username, password, done) {
            __models.user.find({
                where: {
                    user_login: username
                }

            }).then(function (user,err) {

                if (err) {
                    return done(err);
                }
                if (!user) {
                    return done(null, false, {
                        message: 'Username or password invalid'
                    });
                }
                if (!user.authenticate(password)) {
                    return done(null, false, {
                        message: 'Username or password invalid'
                    });
                }
                console.log('*******************',user);
                return done(null, user);

            });

		}
	));
};