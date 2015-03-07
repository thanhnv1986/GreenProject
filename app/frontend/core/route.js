/**
 * Created by thanhnv on 1/28/15.
 */
var passport = require('passport');
module.exports = function (app) {
    app.route('/admin/login').get(function (req, res) {
        if (req.isAuthenticated()) {
            return res.redirect('/admin');
        }
        else {
            res.render('login');
        }
    }).post(function (req, res, next) {
        passport.authenticate('local', function (err, user, info) {
            // Remove sensitive data before login
            user.user_pass = undefined;
            if (info) {
                return res.render('login', {message: info.message});
            }
            else {
                req.login(user, function (err) {
                    if (err) {
                        res.status(400).send(err);
                    } else {
                        return res.redirect('/admin');
                    }
                });
            }
        })(req, res, next);
    });
    app.use('/admin/*', function (req, res, next) {
        //return next();
        if (!req.isAuthenticated()) {
            console.log("redirect to admin login");
            return res.redirect('/admin/login');
        }
//        res.locals.__user = req.user;
        next();
    });
    //Passport Router
    app.get('/auth/facebook', passport.authenticate('facebook', { scope: [ 'email' ] }));
    app.get('/auth/facebook/callback', function (req, res, next) {
        console.log('333333333');
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
}