/**
 * Created by thanhnv on 1/26/15.
 */
var async = require('async');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');

var route = 'roles';
var breadcrumb =
    [
        {
            title: 'Home',
            icon: 'fa fa-dashboard',
            href: '/admin'
        },
        {
            title: 'Roles',
            href: '/admin/roles'
        }
    ];


exports.list = function (req, res) {
    //Them button
    res.locals.createButton = __acl.addButton(req, route, 'create');
    res.locals.deleteButton = __acl.addButton(req, route, 'delete');

    //breadcrumb
    res.locals.breadcrumb = __.create_breadcrumb(breadcrumb);
    __models.role.findAll({
        order: "id desc"
    }).then(function (roles) {
        res.render('roles/index', {
            title: "All Roles",
            roles: roles,
            messages: req.messages || []
        });
    });
};
exports.view = function (req, res) {
    //Them button
    res.locals.saveButton = __acl.addButton(req, route, 'update');
    res.locals.backButton = route;

    //breadcrumb
    res.locals.breadcrumb = __.create_breadcrumb(breadcrumb, {title: 'Update Role'});
    async.parallel([
        function (callback) {
            __models.role.find({
                where: {
                    id: req.params.cid
                }
            }).then(function (roles) {
                callback(null, roles);
            });
        }
    ], function (err, results) {
            console.log(__modules);
            res.render('roles/new', {
                title: "Update Role",
                modules: __modules,
                role: results[0],
                rules: JSON.parse(results[0].rules)
            });
        }
    );

};
exports.update = function (req, res, next) {
    req.messages = [];
    __models.role.find({
        where: {
            id: req.params.cid
        }
    }).then(function (role) {
        var rules = {};
        for (var k in req.body) {
            if (req.body.hasOwnProperty(k)) {
                if (k == 'title') {
                }
                else if (k == 'status') {
                }
                else {
                    rules[k] = req.body[k].join(':');
                }
            }
        }
        role.updateAttributes({
            name: req.body.title,
            status: req.body.status,
            rules: JSON.stringify(rules)
        }).then(function () {
            next();
        });
    });


}
exports.create = function (req, res) {
    //Them button
    res.locals.saveButton = __acl.addButton(req, route, 'create');
    res.locals.backButton = route;
    //breadcrumb
    res.locals.breadcrumb = __.create_breadcrumb(breadcrumb, {title: 'Add New'});
    res.render('roles/new', {
        title: "New Role",
        modules: __modules
    });

}
exports.save = function (req, res, next) {
    req.messages = [];
    var rules = {};
    for (var k in req.body) {
        if (req.body.hasOwnProperty(k)) {
            if (k == 'title') {
            }
            else if (k == 'status') {
            }
            else {
                rules[k] = req.body[k].join(':');
            }
        }
    }
    __models.role.create({
        name: req.body.title,
        status: req.body.status,
        rules: JSON.stringify(rules)
    }).then(function () {
        next();
    });


}
exports.delete = function (req, res) {
    __models.roles.destroy({
        where: {
            id: {
                "in": req.body.ids.split(',')
            }
        }
    }).then(function () {
        res.send(200);
    });
}
