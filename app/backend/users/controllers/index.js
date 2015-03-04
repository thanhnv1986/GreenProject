/**
 * Created by thanhnv on 1/26/15.
 */

var async = require('async');
var fs = require('fs');
var path = require('path');
var slug = require('slug');
var config = require(__base + 'config/config.js');
var formidable = require('formidable');
var redis = require('redis').createClient();

var crypto = require('crypto'),
    mailer = require('nodemailer');

var index_template = 'users/index';
var edit_template = 'users/new';
var folder_upload = __base + 'public/img/users/';
var route = 'users';
var breadcrumb =
    [
        {
            title: 'Home',
            icon: 'fa fa-dashboard',
            href: '/admin'
        },
        {
            title: 'Users',
            href: '/admin/users'
        }
    ];

exports.list = function (req, res) {
    //Add button
    res.locals.createButton = __acl.addButton(req, route, 'create');
    //breadcrumb
    res.locals.breadcrumb = __.create_breadcrumb(breadcrumb);
    var page = req.params.page;
    __models.user.findAndCountAll({
        include: [__models.role],
        order: "id desc",
        limit: config.pagination.number_item,
        offset: (page - 1) * config.pagination.number_item
    }).then(function (results) {
        var totalPage = Math.ceil(results.count / config.pagination.number_item);
        res.render(index_template, {
            title: "All Users",
            totalPage: totalPage,
            users: results.rows,
            currentPage: page

        });
    });
};
exports.view = function (req, res) {
    res.locals.saveButton = __acl.addButton(req, route, 'create');
    res.locals.backButton = route;
    res.locals.breadcrumb = __.create_breadcrumb(breadcrumb, {title: 'Update User'});
    async.parallel([
        function (callback) {
            __models.role.findAll().then(function (roles) {
                callback(null, roles);
            });
        }
    ], function (err, results) {
        res.render(edit_template, {
            title: "Update Users",
            roles: results[0],
            user: req.user,
            id: req.params.cid
        });
    });

};
exports.update = function (req, res, next) {
    var data = req.body;
    __models.user.find({
        where: {
            id: req.params.cid
        }
    }).then(function (user) {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            data = fields;

            if (files.user_image_url.name != '') {
                var type = files.user_image_url.name.split('.');
                type = type[type.length - 1];
                var fileName = folder_upload + slug(fields.user_login).toLowerCase() + '.' + type;
                fs.rename(files.user_image_url.path, fileName, function (err) {
                   if(err){
                       req.flash.error("Lỗi khi thêm việc làm mới: không upload được logo.");
                       return next();
                   }
                });
                data.user_image_url = '/img/users/' + slug(fields.user_login).toLowerCase() + '.' + type;
            }

            user.updateAttributes(data).then(function () {
                req.flash.success("Updated user successfull");
                next();
            });

        });

    });


};
exports.create = function (req, res) {
    //Them button
    res.locals.saveButton = __acl.addButton(req, route, 'create');
    res.locals.backButton = route;
    //breadcrumb
    res.locals.breadcrumb = __.create_breadcrumb(breadcrumb, {title: 'New User'});
    async.parallel([
        function (callback) {
            __models.role.findAll({
                order: "id asc"
            }).then(function (roles) {
                callback(null, roles);
            });
        }
    ], function (err, results) {

        res.render(edit_template, {
            title: "Add New User",
            roles: results[0]
        });
    });
};
exports.save = function (req, res, next) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var data = fields;
        data.id = new Date().getTime();
        var type = files.user_image_url.name.split('.');
        type = type[type.length - 1];
        var fileName = folder_upload + slug(fields.user_login).toLowerCase() + '.' + type;
        fs.rename(files.user_image_url.path, fileName, function (err) {
            if (err) {
                req.flash.error("Lỗi khi thêm việc làm mới: không upload được logo.");
                next();
            }
            data.user_image_url = '/img/users/' + slug(fields.user_login).toLowerCase() + '.' + type;
            __models.user.create(data).then(function () {
                req.flash.success("Add new user successful");
                next();
            });
        });

    });

};
exports.delete = function (req, res) {
    var ids = req.body.ids.split(',');
    async.waterfall([
        /*function (done) {
         __models.usermeta.destroy({
         where: {
         user_id: {
         "in": ids
         }
         }
         }).then(function () {
         done(null);
         });
         },
         function (done) {
         __models.user_answer.destroy({
         where: {
         user_id: {
         "in": ids
         }
         }
         }).then(function () {
         done(null);
         });
         },*/
        function (done) {
            __models.user.destroy({
                where: {
                    id: {
                        "in": ids
                    }
                }
            }).then(function () {
                done(null);
            });
        }
    ], function (err) {
        res.sendStatus(200);
    });

};
/**
 * Signout
 */
exports.signout = function (req, res) {
    var key = 'current-user-' + req.user.id;
    redis.del(key);
    req.logout();
    res.redirect('/admin/login');
};
/**
 * Profile
 */
exports.profile = function (req, res) {
    res.locals.breadcrumb = __.create_breadcrumb(breadcrumb, {title: 'Profile'});
    __models.role.findAll({
        order: "id asc"
    }).then(function (roles) {
        res.render('users/new', {
            user: req.user,
            roles: roles
        });
    });
};

/**
 * Change pass view
 */
exports.changePass = function (req, res) {
    res.locals.breadcrumb = __.create_breadcrumb(breadcrumb, {title: 'Change password'});
    res.render('users/change-pass', {
        user: req.user
    });

};

/**
 * Update pass view
 */
exports.updatePass = function (req, res) {
    var old_pass = req.body.old_pass;
    var user_pass = req.body.user_pass;
    __models.user.find(req.user.id).then(function (user) {
        if (user.authenticate(old_pass)) {
            user.updateAttributes({
                user_pass: user.hashPassword(user_pass)
            }).then(function () {
                res.render('users/change-pass', {
                    messages: [
                        { type: 'success', content: "Changed password successful"}
                    ]
                })
            });
        }
        else {
            res.render('users/change-pass', {
                messages: [
                    { type: 'error', content: "Password invalid"}
                ]
            })
        }
    });
};

/**
 * Forgot for reset password (forgot POST)
 */
exports.forgot = function(req, res, next) {
    async.waterfall([
        // Generate random token
        function(done) {
            crypto.randomBytes(20, function(err, buffer) {
                var token = buffer.toString('hex');
                console.log(token, '\n@@@\n');
                done(err, token);
            });
        },
        // Lookup user by user_email
        function(token, done) {
            if (req.body.email) {
                __models.user.find({
                    where: 'user_email=\'' + req.body.email + '\''
                }).then(function(user) {
                    if (!user) {
                        res.render('reset-password', {
                            message: { type: 'error', content: 'No account with that email has been found'}
                        });
                    }
                    //else if (user.provider !== 'local') {
                    //    res.render('reset-password', {
                    //        message: { type: 'error', content: 'It seems like you signed up using your ' + user.provider + ' account'}
                    //    });
                    //}
                    else {
                        var data = {};
                        data.resetpasswordtoken = token;
                        data.resetpasswordexpires = Date.now() + 3600000; // 1 hour
                        user.updateAttributes(data).then(function(user) {
                            done(null, token, user);
                        });
                    }
                });
            } else {
                res.render('reset-password', {
                    message: { type: 'error', content: 'Username field must not be blank'}
                });
            }
        },
        function(token, user, done) {
            res.render('email-templates/reset-password-email', {
                name: user.display_name,
                appName: config.app.title,
                url: 'http://' + req.headers.host + '/users/reset/' + user.id + '/' + token
            }, function(err, emailHTML) {
                done(err, emailHTML, user);
            });
        },
        // If valid email, send reset email using service
        function(emailHTML, user, done) {
            var transporter = mailer.createTransport(config.mailer_config);
            var mailOptions = {
                to: user.user_email,
                from: config.mailer.from,
                subject: 'Password Reset',
                html: emailHTML
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                    done(err);
                } else {
                    console.log('Message sent: ' + info.response);
                    res.render('reset-password', {
                        message: { type: 'success', content: 'An email has been sent to ' + user.user_email + ' with further instructions. Please follow the guide in email to reset password'}
                    });
                }
            });
        }
    ], function(err) {
        if (err) return next(err);
    });
};

/**
 * Reset password GET from email token
 */
exports.validateResetToken = function(req, res, next) {
    var where = 'id=' + req.params.userid + ' and resetpasswordtoken=\'' + req.params.token + '\'' + ' and resetpasswordexpires > ' + Date.now();
    __models.user.find({
        where: where
    }).then(function(user) {
        if (!user) {
            return res.redirect('/password/reset/invalid');
        }
        next();
    });
};

/**
 * Return view invalid token
 * @param req
 * @param res
 */
exports.invalidToken = function(req, res) {
    res.render('reset-password', {
        message: { type: 'error', content: 'Password reset token is invalid or has expired.'}
    });
};

/**
 * Return view for type reset password
 * @param req
 * @param res
 */
exports.resetForm = function(req, res) {
    res.render('reset-password', {
        form: true
    });
};

/**
 * Reset password POST from email token (post form with new password)
 */
exports.reset = function(req, res, next) {
    // Init Variables
    var time = Date.now();
    var passwordDetails = req.body;
    var where = 'id=' + req.params.userid + ' and resetpasswordtoken=\'' + req.params.token + '\'' + ' and resetpasswordexpires > ' + time;

    async.waterfall([

        function(done) {
            __models.user.find({
                where: where
            }).then(function(user) {
                if (user) {
                    if (passwordDetails.newpassword === passwordDetails.retype_password) {
                        var data = {};
                        data.user_pass = user.hashPassword(passwordDetails.newpassword);
                        data.resetpasswordtoken = '';
                        data.resetpasswordexpires = null;

                        user.updateAttributes(data).then(function(user) {
                            if (!user) {
                                res.render('reset-password', {
                                    message: { type: 'error', content: 'Can not update user'}
                                });
                            } else {
                                done(null, user);
                            }
                        });
                    } else {
                        res.render('reset-password', {
                            message: { type: 'error', content: 'Passwords do not match'}
                        });
                    }
                } else {
                    res.render('reset-password', {
                        message: { type: 'error', content: 'Password reset token is invalid or has expired.'}
                    });
                }
            });
        },
        function(user, done) {
            res.render('email-templates/reset-password-confirm-email', {
                name: user.display_name,
                appName: config.app.title,
                site: 'http://' + req.headers.host ,
                login_url: 'http://' + req.headers.host + '/admin/login'
            }, function(err, emailHTML) {
                done(err, emailHTML, user);
            });
        },
        // If valid email, send reset email using service
        function(emailHTML, user, done) {
            var smtpTransport = mailer.createTransport(config.mailer_config);
            var mailOptions = {
                to: user.user_email,
                from: config.mailer.from,
                subject: 'Your password has been changed',
                html: emailHTML
            };

            smtpTransport.sendMail(mailOptions, function(err, info) {
                done(err, 'done');
            });
        }
    ], function(err) {
        if (err) res.send(err);
        else {
            res.render('reset-password', {
                message: { type: 'success', content: 'Reset password successfully.'}
            });
        }
    });
};

exports.userById = function(req, res, next, id){
    __models.user.find({
        include:[__models.roles],
        where:{
            id:id
        }
    }).then(function(user){
        req.user = user;
        next();
    })
};