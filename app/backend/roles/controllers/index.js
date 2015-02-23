/**
 * Created by thanhnv on 1/26/15.
 */
var async = require('async');
var fs = require('fs');
var path = require('path');

var route = 'roles';
exports.list = function (req, res) {
    //Them button
    res.locals.createButton = __acl.addButton(req, route, 'create');
    res.locals.deleteButton = __acl.addButton(req, route, 'delete');
    //breadcrump
    res.locals.breadcrump = [
        {
            title:'Home',
            icon:'fa fa-dashboard',
            href:'/admin'
        },
        {
            title:'Roles'
        }

    ];
    __models.role.findAll({
        order: "id desc"
    }).then(function (roles) {
        res.render('roles/index', {
            primaryHeader: "Vai trò",
            subHeader: "Danh sách vai trò",
            roles: roles,
            messages: req.messages || []
        });
    });
};
exports.view = function (req, res) {
    //Them button
    res.locals.saveButton = __acl.addButton(req, route, 'update');
    res.locals.backButton = route;
    //breadcrump
    res.locals.breadcrump = [
        {
            title:'Home',
            icon:'fa fa-dashboard',
            href:'/admin'
        },
        {
            title:'Roles',
            href:'/admin/roles'
        },
        {
            title:'Update'
        }
    ];
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
            res.render('roles/new', {
                primaryHeader: "Vai trò",
                subHeader: "Cập nhật vai trò",
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
    //breadcrump
    res.locals.breadcrump = [
        {
            title:'Home',
            icon:'fa fa-dashboard',
            href:'/admin'
        },
        {
            title:'Roles',
            href:'/admin/roles'
        },
        {
            title:'Add New'
        }
    ];
    res.render('roles/new', {
        primaryHeader: "Vai trò",
        subHeader: "Thêm vai trò",
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
    models.role.create({
        name: req.body.title,
        status: req.body.status,
        rules: JSON.stringify(rules)
    }).then(function () {
        next();
    });


}
exports.delete = function (req, res) {
    models.role.destroy({
        where: {
            id: {
                "in": req.body.ids.split(',')
            }
        }
    }).then(function () {
        res.send(200);
    });
}
