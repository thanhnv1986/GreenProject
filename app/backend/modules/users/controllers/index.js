/**
 * Created by thanhnv on 1/26/15.
 */
var BaseModule = require(__base + 'app/backend/base_module.js'),
    util = require('util'),
    _ = require('lodash');

var promise = require('bluebird');

var renameAsync = promise.promisify(require('fs').rename);

var formidable = require('formidable');
promise.promisifyAll(formidable);

var redis = require('redis').createClient();

var path = require('path');
var slug = require('slug');
var config = require(__base + 'config/config.js');

var list_template = 'index.html';
var edit_template = 'new.html';
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

function UsersModule() {
    BaseModule.call(this);
    this.path = "/users";
}
var _module = new UsersModule();

_module.list = function (req, res) {
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
        _module.render(req, res, 'index.html', {
            title: "All Users",
            totalPage: totalPage,
            items: results.rows,
            currentPage: page

        });

    }).catch(function (error) {
        req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);
        _module.render(req, res, 'index.html', {
            title: "All Users",
            totalPage: 1,
            users: null,
            currentPage: 1
        });
    });
};

_module.view = function (req, res) {
    var self = this;
    // Add button
    res.locals.saveButton = __acl.addButton(req, route, 'create');
    res.locals.backButton = __acl.addButton(req, route, 'index', '/admin/users');

    // Breadcrumb
    res.locals.breadcrumb = __.create_breadcrumb(breadcrumb, {title: 'Update User'});

    // Get user by session and list roles
    __models.role.findAll().then(function (roles) {
        BaseModule.prototype.render.call(self, edit_template, {
            title: "Update Users",
            roles: roles,
            user: req._user,
            id: req.params.cid
        });
    }).catch(function (error) {
        req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);
        _module.render(req, res, edit_template, {
            title: "Update Users",
            roles: null,
            users: null,
            id: 0
        });
    });
};

_module.update = function (req, res, next) {
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

_module.create = function (req, res) {
    // Add button
    res.locals.saveButton = __acl.addButton(req, route, 'create');
    res.locals.backButton = __acl.addButton(req, route, 'index', '/admin/users');

    // Breadcrumb
    res.locals.breadcrumb = __.create_breadcrumb(breadcrumb, {title: 'New User'});

    // Get list roles
    __models.role.findAll({
        order: "id asc"
    }).then(function (roles) {
        _module.render(req, res, edit_template, {
            title: "Add New User",
            roles: roles
        });
    }).catch(function (error) {
        req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);
        _module.render(req, res, edit_template, {
            title: "Add New User",
            roles: null
        });
    });
};

_module.save = function (req, res, next) {
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

_module.delete = function (req, res) {
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
_module.signout = function (req, res) {
    var key = 'current-user-' + req.user.id;
    redis.del(key);
    req.logout();
    res.redirect('/admin/login');
};

/**
 * Profile
 */
_module.profile = function (req, res) {
    // Add button
    res.locals.saveButton = __acl.addButton(req, route, 'create');
    res.locals.backButton = __acl.addButton(req, route, 'index', '/admin/users');
    //breadcrumb
    res.locals.breadcrumb = __.create_breadcrumb(breadcrumb, {title: 'Profile'});
    __models.role.findAll({
        order: "id asc"
    }).then(function (roles) {
        _module.render(req, res, 'new.html', {
            user: req.user,
            roles: roles
        });
    }).catch(function (error) {
        req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);
        _module.render(req, res, 'new.html', {
            user: null,
            roles: null
        });
    });
};

/**
 * Change pass view
 */
_module.changePass = function (req, res) {
    res.locals.breadcrumb = __.create_breadcrumb(breadcrumb, {title: 'Change password'});
    _module.render(req, res, 'users/change-pass', {
        user: req.user
    });
};

/**
 * Update pass view
 */
_module.updatePass = function (req, res) {
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
                _module.render(req, res, 'users/change-pass');
            });
        }
        else {
            req.flash.warning("Password invalid");
            _module.render(req, res, 'users/change-pass');
        }
    });
};

_module.saveOAuthUserProfile = function (req, profile, done) {
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

_module.userById = function (req, res, next, id) {
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

util.inherits(UsersModule, BaseModule);
module.exports = _module;