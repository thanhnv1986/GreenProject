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

    // List users
    __models.user.findAndCountAll({
        include: [__models.role],
        order: "id desc",
        limit: config.pagination.number_item,
        offset: (page - 1) * config.pagination.number_item
    }).then(function (results) {
        var totalPage = Math.ceil(results.count / config.pagination.number_item);
        res.render(list_template, {
            title: "All Users",
            totalPage: totalPage,
            users: results.rows,
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
    }).then(function(result){
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
        if(error.name == 'SequelizeUniqueConstraintError'){
            req.flash.error('Email already exist');
            return next();
        }else{
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
        if(error.name == 'SequelizeUniqueConstraintError'){
            req.flash.error('Email already exist');
            return next();
        }else{
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
