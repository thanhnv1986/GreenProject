/**
 * Created by thanhnv on 1/28/15.
 */
var passport = require('passport');
var config = require(__base + 'config/config.js');
module.exports = function (app) {
    // Passport Router
    app.get('/auth/facebook', passport.authenticate('facebook', { scope: [ 'email' ] }));
    app.get('/auth/facebook/callback', function (req, res, next) {
        passport.authenticate("facebook", function (err, user, redirectURL) {
            if (err || !user) {
                return res.redirect('/signin');
            }
            req.login(user, function (err) {
                if (err) {
                    return res.redirect('/signin');
                }
                return res.redirect(redirectURL || '/');
            });
        })(req, res, next);
    });

};