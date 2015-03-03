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
        },
        function (callback) {
            __models.user.find({
                where: {
                    id: req.params.cid
                }
            }).then(function (us) {
                callback(null, us);
            });
        }
    ], function (err, results) {
        res.render(edit_template, {
            title: "Update Users",
            roles: results[0],
            user: results[1],
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


}
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
}
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

}
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

}
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