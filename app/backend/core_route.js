/**
 * Created by thanhnv on 3/11/15.
 */
var passport = require('passport');
var config = require(__base + 'config/config.js');

var mailer = require('nodemailer');

var promise = require('bluebird');
var randomBytesAsync = promise.promisify(require('crypto').randomBytes);

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
                req.flash.error(info.message);
                return res.render('login');
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

    app.route('/admin/forgot-password').get(function (req, res) {
        res.render('forgot-password');
    }).post(function (req, res, next) {
        if (!req.body.email) {
            req.flash.warning('Email is required');
            return res.render('forgot-password');
        }

        var token = '';

        // Generate random token
        var promises = randomBytesAsync(20).then(function (buffer) {
            token = buffer.toString('hex');

            // Lookup user by user_email
            return __models.user.find({
                where: 'user_email=\'' + req.body.email + '\''
            });
        }).then(function (user) {
            if (!user) {
                req.flash.warning('No account with that email has been found');
                res.render('forgot-password');
                return promises.cancel();
            } else {
                // Block spam
                var time = Date.now() + 3600000; // 1 hour

                if (user.reset_password_expires != null) {
                    if (time - user.reset_password_expires < 900000) // 15 minutes
                    {
                        var min = 15 - Math.ceil((time - user.reset_password_expires) / 60000);
                        req.flash.warning('An reset password email has already been sent. Please try again in ' + min + ' minutes.');
                        res.render('reset-password');
                        return promises.cancel();
                    }
                }

                // Update user
                var data = {};
                data.reset_password_token = token;
                data.reset_password_expires = time;
                return user.updateAttributes(data)
            }
        }).then(function (user) {
            // Send reset password email
            res.render('email-templates/reset-password-email', {
                name: user.display_name,
                appName: config.app.title,
                url: 'http://' + req.headers.host + '/admin/reset/' + user.id + '/' + token
            }, function (err, emailHTML) {
                if (err) {
                    next(err);
                    return promises.cancel();
                } else {
                    var mailOptions = {
                        to: user.user_email,
                        from: config.mailer.from,
                        subject: 'Password Reset',
                        html: emailHTML
                    };

                    return sendMail(mailOptions).then(function (info) {
                        req.flash.success('An email has been sent to ' + user.user_email + ' with further instructions. Please follow the guide in email to reset password');
                        return res.render('reset-password');
                    });
                }
            });
        }).catch(function (error) {
            req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);
            return next();
        });
    });

    app.route('/admin/reset/:userid/:token').get(function (req, res, next) {
        __models.user.find({
            where: {
                id: req.params.userid,
                reset_password_token: req.params.token,
                reset_password_expires: {
                    $gt: Date.now()
                }
            }
        }).then(function (user) {
            if (!user) {
                req.flash.error('Password reset token is invalid or has expired');
                return res.render('reset-password');
            } else {
                return next();
            }
        });
    },function (req, res) {
        res.render('reset-password', {
            form: true
        });
    }).post(function (req, res) {
        var passwordDetails = req.body;

        var promises = __models.user.find({
            where: {
                id: req.params.userid,
                reset_password_token: req.params.token,
                reset_password_expires: {
                    $gt: Date.now()
                }
            }
        }).then(function (user) {
            if (user) {
                if (passwordDetails.newpassword === passwordDetails.retype_password) {
                    var data = {};
                    data.user_pass = user.hashPassword(passwordDetails.newpassword);
                    data.reset_password_token = '';
                    data.reset_password_expires = null;

                    return user.updateAttributes(data);
                } else {
                    req.flash.warning('Passwords do not match');
                    res.render('reset-password', {form: true});
                    return promises.cancel();
                }
            } else {
                req.flash.warning('Password reset token is invalid or has expired');
                res.render('reset-password');
                return promises.cancel();
            }
        }).then(function (user) {
            res.render('email-templates/reset-password-confirm-email', {
                name: user.display_name,
                appName: config.app.title,
                site: 'http://' + req.headers.host,
                login_url: 'http://' + req.headers.host + '/admin/login'
            }, function (err, emailHTML) {
                var mailOptions = {
                    to: user.user_email,
                    from: config.mailer.from,
                    subject: 'Your password has been changed',
                    html: emailHTML
                };

                return sendMail(mailOptions).then(function (info) {
                    req.flash.success('Reset password successfully');
                    return res.render('reset-password');
                });
            });
        }).catch(function (error) {
            req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);
            return next();
        });
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

    function sendMail(mailOptions) {
        return new Promise(function (fulfill, reject) {
            var transporter = mailer.createTransport(config.mailer_config);
            transporter.sendMail(mailOptions, function (err, info) {
                if (err !== null) {
                    reject(err);
                } else {
                    fulfill(info);
                }
            });
        });
    }
};