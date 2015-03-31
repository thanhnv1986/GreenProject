'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
	path = require('path'),
    redis = require('redis').createClient(),
	config = require('./config');
	
/**
 * Module init function.
 */
module.exports = function() {
	// Serialize sessions
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	// Deserialize sessions
	passport.deserializeUser(function(id, done) {
        var key = 'current-user-'+id;
        redis.get(key, function(err, result){
            if(result!=null){
                var user = JSON.parse(result);
                user.acl = JSON.parse(user.role.rules);
                done(null, user);
            }
            else{
                __models.user.find({
                    include:[__models.role],
                    where:{
                        id:id
                    }
                }).then(function (user) {
                    user.acl = JSON.parse(user.role.rules);
                    redis.setex(key,300, JSON.stringify(user));
                    done(null, user);
                });

            }
        });

	});

	// Initialize strategies
	config.getGlobbedFiles('./config/strategies/**/*.js').forEach(function(strategy) {
		require(path.resolve(strategy))();
	});
};