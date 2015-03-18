/**
 * Created by thanhnv on 1/26/15.
 */
var promise = require('bluebird');

var renameAsync = promise.promisify(require('fs').rename);

var formidable = require('formidable');
promise.promisifyAll(formidable);

var redis = require('redis').createClient();

var path = require('path');
var slug = require('slug');
var config = require(__base + 'config/config.js');

var list_template = 'users/index';
var edit_template = 'users/new';
var folder_upload = '/img/users/';
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
    // Add button
    res.locals.createButton = __acl.addButton(req, route, 'create', '/admin/users/create');

    // Breadcrumb
    res.locals.breadcrumb = __.create_breadcrumb(breadcrumb);

    var page = req.params.page || 1;
    var column = req.params.sort || 'id';
    var order = req.params.order || '';
    //Config columns
    res.locals.root_link = '/admin/users/page/' + page + '/sort';
    var filter = __.createFilter(req, res, route, '/admin/users', column, order, [
        {
            column: "id",
            width: '10%',
            header: "Id",
            filter: {
                model: 'user',
                data_type: 'number'
            }

        },
        {
            column: "display_name",
            width: '25%',
            header: "Full Name",
            link: '/admin/users/{id}',
            acl: 'users.update',
            filter: {
                data_type: 'string'
            }

        },
        {
            column: "user_login",
            width: '15%',
            header: "UserName",
            filter: {
                data_type: 'string'
            }
        },
        {
            column: "user_email",
            width: '15%',
            header: "Email",
            filter: {
                data_type: 'string'
            }
        },
        {
            column: "role.name",
            width: '15%',
            header: "Role",
            filter: {
                type: 'select',
                filter_key: 'role_id',
                data_source: 'arr_role',
                display_key: 'name',
                value_key: 'id'
            }
        },
        {
            column: "user_status",
            width: '10%',
            header: "Status",
            filter: {
                type: 'select',
                filter_key: 'user_status',
                data_source: [
                    {
                        name: "publish"
                    },
                    {
                        name: "un-publish"
                    }
                ],
                display_key: 'name',
                value_key: 'name'
            }
        }
    ]);
    // List users
    __models.user.findAndCountAll({
        include: [
            {
                model: __models.role
            }
        ],
        order: column + " " + order,
        limit: config.pagination.number_item,
        offset: (page - 1) * config.pagination.number_item,
        where: filter.values
    }).then(function (results) {
        var totalPage = Math.ceil(results.count / config.pagination.number_item);
        res.render(list_template, {
            title: "All Users",
            totalPage: totalPage,
            items: results.rows,
            currentPage: page

        });
    }).catch(function (error) {
        req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);
        res.render(list_template, {
            title: "All Users",
            totalPage: 1,
            users: null,
            currentPage: 1
        });
    });
};

exports.view = function (req, res) {
    // Add button
    res.locals.saveButton = __acl.addButton(req, route, 'create');
    res.locals.backButton = __acl.addButton(req, route, 'index', '/admin/users');

    // Breadcrumb
    res.locals.breadcrumb = __.create_breadcrumb(breadcrumb, {title: 'Update User'});

    // Get user by session and list roles
    __models.role.findAll().then(function (roles) {
        res.render(edit_template, {
            title: "Update Users",
            roles: roles,
            user: req._user,
            id: req.params.cid
        });
    }).catch(function (error) {
        req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);
        res.render(edit_template, {
            title: "Update Users",
            roles: null,
            users: null,
            id: 0
        });
    });
};

exports.update = function (req, res, next) {
    var edit_user = null;

    // Get user by id
    __models.user.find({
        where: {
            id: req.params.cid
        }
    }).then(function (user) {
        edit_user = user;

        // Get form data
        var form = new formidable.IncomingForm();

        return form.parseAsync(req);
    }).then(function (result) {
        var data = result[0];
        var files = result[1];

        // Check user image was changed
        if (files.user_image_url.name != '') {
            var type = files.user_image_url.name.split('.');
            type = type[type.length - 1];
            var fileName = folder_upload + slug(data.user_login).toLowerCase() + '.' + type;
            return renameAsync(files.user_image_url.path, __base + 'public' + fileName).then(function () {
                data.user_image_url = fileName;
                return data;
            });
        } else {
            return data;
        }
    }).then(function (data) {
        return edit_user.updateAttributes(data).then(function () {
            req.flash.success("Update user successfully");
            res.redirect('/admin/users/');
        });
    }).catch(function (error) {
        if (error.name == 'SequelizeUniqueConstraintError') {
            req.flash.error('Email already exist');
            return next();
        } else {
            req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);
            return next();
        }
    });
};

exports.create = function (req, res) {
    // Add button
    res.locals.saveButton = __acl.addButton(req, route, 'create');
    res.locals.backButton = __acl.addButton(req, route, 'index', '/admin/users');

    // Breadcrumb
    res.locals.breadcrumb = __.create_breadcrumb(breadcrumb, {title: 'New User'});

    // Get list roles
    __models.role.findAll({
        order: "id asc"
    }).then(function (roles) {
        res.render(edit_template, {
            title: "Add New User",
            roles: roles
        });
    }).catch(function (error) {
        req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);
        res.render(edit_template, {
            title: "Add New User",
            roles: null
        });
    });
};

exports.save = function (req, res, next) {
    // Get form data
    var form = new formidable.IncomingForm();
    form.parseAsync(req).then(function (result) {
        var data = result[0];
        var files = result[1];
        data.id = new Date().getTime();

        // Check user image was uploaded
        if (files.user_image_url.name != '') {
            var type = files.user_image_url.name.split('.');
            type = type[type.length - 1];

            var fileName = folder_upload + slug(data.user_login).toLowerCase() + '.' + type;

            return renameAsync(files.user_image_url.path, __base + 'public' + fileName).then(function () {
                data.user_image_url = fileName;
                return data;
            });
        } else {
            return data;
        }
    }).then(function (data) {
        return __models.user.create(data).then(function () {
            req.flash.success("Add new user successfully");
            res.redirect('/admin/users/');
        });
    }).catch(function (error) {
        if (error.name == 'SequelizeUniqueConstraintError') {
            req.flash.error('Email already exist');
            return next();
        } else {
            req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);
            return next();
        }
    });
};

exports.delete = function (req, res) {
    // Check delete current user
    var ids = req.body.ids;
    var id = req.user.id;
    var index = ids.indexOf(id);

    // Delete user
    if (index == -1) {
        __models.user.destroy({
            where: {
                id: {
                    "in": ids.split(',')
                }
            }
        }).then(function () {
            req.flash.success("Delete user successfully");
            res.sendStatus(204);
        }).catch(function (error) {
            req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);
            res.sendStatus(200);
        });
    } else {
        req.flash.warning("Cannot delete current user");
        res.sendStatus(200);
    }
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
    // Add button
    res.locals.saveButton = __acl.addButton(req, route, 'create');
    res.locals.backButton = __acl.addButton(req, route, 'index', '/admin/users');
    //breadcrumb
    res.locals.breadcrumb = __.create_breadcrumb(breadcrumb, {title: 'Profile'});
    __models.role.findAll({
        order: "id asc"
    }).then(function (roles) {
        res.render('users/new', {
            user: req.user,
            roles: roles
        });
    }).catch(function (error) {
        req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);
        res.render('users/new', {
            user: null,
            roles: null
        });
    });
};

exports.update_profile = function (req, res, next) {


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
                req.flash.success("Changed password successful");
            }).catch(function (error) {
                req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);
            }).finally(function () {
                res.render('users/change-pass');
            });
        }
        else {
            req.flash.warning("Password invalid");
            res.render('users/change-pass');
        }
    });
};

/**
 * Forgot for reset password (forgot POST)
 */
exports.forgot = function (req, res, next) {
    async.waterfall([
        // Generate random token
        function (done) {
            crypto.randomBytes(20, function (err, buffer) {
                var token = buffer.toString('hex');
                console.log(token, '\n@@@\n');
                done(err, token);
            });
        },
        // Lookup user by user_email
        function (token, done) {
            if (req.body.email) {
                __models.user.find({
                    where: 'user_email=\'' + req.body.email + '\''
                }).then(function (user) {
                    if (!user) {
                        res.render('reset-password', {
                            message: {type: 'error', content: 'No account with that email has been found'}
                        });
                    }
                    //else if (user.provider !== 'local') {
                    //    res.render('reset-password', {
                    //        message: { type: 'error', content: 'It seems like you signed up using your ' + user.provider + ' account'}
                    //    });
                    //}
                    else {
                        var data = {};
                        data.reset_password_token = token;
                        data.reset_password_expires = Date.now() + 3600000; // 1 hour
                        user.updateAttributes(data).then(function (user) {
                            done(null, token, user);
                        });
                    }
                });
            } else {
                res.render('reset-password', {
                    message: {type: 'error', content: 'Username field must not be blank'}
                });
            }
        },
        function (token, user, done) {
            res.render('email-templates/reset-password-email', {
                name: user.display_name,
                appName: config.app.title,
                url: 'http://' + req.headers.host + '/users/reset/' + user.id + '/' + token
            }, function (err, emailHTML) {
                done(err, emailHTML, user);
            });
        },
        // If valid email, send reset email using service
        function (emailHTML, user, done) {
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
                        message: {
                            type: 'success',
                            content: 'An email has been sent to ' + user.user_email + ' with further instructions. Please follow the guide in email to reset password'
                        }
                    });
                }
            });
        }
    ], function (err) {
        if (err) return next(err);
    });
};

/**
 * Reset password GET from email token
 */
exports.validateResetToken = function (req, res, next) {
    var where = 'id=' + req.params.userid + ' and reset_password_token=\'' + req.params.token + '\'' + ' and reset_password_expires > ' + Date.now();
    __models.user.find({
        where: where
    }).then(function (user) {
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
exports.invalidToken = function (req, res) {
    res.render('reset-password', {
        message: {type: 'error', content: 'Password reset token is invalid or has expired.'}
    });
};

/**
 * Return view for type reset password
 * @param req
 * @param res
 */
exports.resetForm = function (req, res) {
    res.render('reset-password', {
        form: true
    });
};

/**
 * Reset password POST from email token (post form with new password)
 */
exports.reset = function (req, res, next) {
    // Init Variables
    var time = Date.now();
    var passwordDetails = req.body;
    var where = 'id=' + req.params.userid + ' and reset_password_token=\'' + req.params.token + '\'' + ' and reset_password_expires > ' + time;

    async.waterfall([
        function (done) {
            __models.user.find({
                where: where
            }).then(function (user) {
                if (user) {
                    if (passwordDetails.newpassword === passwordDetails.retype_password) {
                        var data = {};
                        data.user_pass = user.hashPassword(passwordDetails.newpassword);
                        data.reset_password_token = '';
                        data.reset_password_expires = null;

                        user.updateAttributes(data).then(function (user) {
                            if (!user) {
                                res.render('reset-password', {
                                    message: {type: 'error', content: 'Can not update user'}
                                });
                            } else {
                                done(null, user);
                            }
                        });
                    } else {
                        res.render('reset-password', {
                            message: {type: 'error', content: 'Passwords do not match'}
                        });
                    }
                } else {
                    res.render('reset-password', {
                        message: {type: 'error', content: 'Password reset token is invalid or has expired.'}
                    });
                }
            });
        },
        function (user, done) {
            res.render('email-templates/reset-password-confirm-email', {
                name: user.display_name,
                appName: config.app.title,
                site: 'http://' + req.headers.host,
                login_url: 'http://' + req.headers.host + '/admin/login'
            }, function (err, emailHTML) {
                done(err, emailHTML, user);
            });
        },
        // If valid email, send reset email using service
        function (emailHTML, user, done) {
            var smtpTransport = mailer.createTransport(config.mailer_config);
            var mailOptions = {
                to: user.user_email,
                from: config.mailer.from,
                subject: 'Your password has been changed',
                html: emailHTML
            };

            smtpTransport.sendMail(mailOptions, function (err, info) {
                done(err, 'done');
            });
        }
    ], function (err) {
        if (err) res.send(err);
        else {
            res.render('reset-password', {
                message: {type: 'success', content: 'Reset password successfully.'}
            });
        }
    }).catch(function (error) {
        req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);
        res.render('users/change-pass');
    });
};

exports.saveOAuthUserProfile = function (req, profile, done) {
    __models.user.find(profile.id).then(function (user) {
        if (user) {
            user.updateAttributes(profile).then(function (user) {
                return done(null, user);
            });
        }
        else {
            __models.user.create(profile).then(function (user) {
                return done(null, user);
            });
        }
    });
};

exports.userById = function (req, res, next, id) {
    __models.user.find({
        include: [__models.role],
        where: {
            id: id
        }
    }).then(function (user) {
        req._user = user;
        next();
    })
};
