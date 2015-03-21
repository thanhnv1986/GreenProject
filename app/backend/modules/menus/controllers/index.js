/**
 * Created by thanhnv on 2/17/15.
 */
var
    util = require('util'),
    _ = require('lodash');
var promise = require('bluebird');

var route = 'menus';
var breadcrumb =
    [
        {
            title: 'Home',
            icon: 'fa fa-dashboard',
            href: '/admin'
        },
        {
            title: 'Menus',
            href: '/admin/menus'
        }
    ];
function MenusModule() {
    BaseModuleBackend.call(this);
    this.path = "/menus";
}
var _module = new MenusModule();


_module.index = function (req, res) {
    // Add button
    res.locals.createButton = __acl.addButton(req, route, 'create', '/admin/menus/create');
    res.locals.deleteButton = __acl.addButton(req, route, 'delete');

    // Breadcrumb
    res.locals.breadcrumb = __.create_breadcrumb(breadcrumb);

    //Config ordering
    var column = req.params.sort || 'id';
    var order = req.params.order || '';
    res.locals.root_link = '/admin/menus/sort';
    //Config columns
    __.createFilter(req, res, '', '/admin/menus', column, order, [
        {
            column: "id",
            width: '1%',
            header: "",
            type: 'checkbox'
        },
        {
            column: "name",
            width: '25%',
            header: "Name",
            link: '/admin/menus/{id}',
            acl: 'users.update'
        },
        {
            column: "status",
            width: '15%',
            header: "Status"
        }
    ]);
    __models.menus.findAll({
        order: column + " " + order
    }, {raw: true}).then(function (menus) {
        _module.render(req, res, 'index', {
            title: "All Menus",
            items: menus
        });
    }).catch(function (error) {
        req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);
        _module.render(req, res, 'index', {
            title: "All Menus",
            menus: null
        });
    });
};

_module.create = function (req, res) {
    // Add button
    res.locals.saveButton = __acl.addButton(req, route, 'create');
    res.locals.backButton = __acl.addButton(req, route, 'index', '/admin/menus');

    // Breadcrumb
    res.locals.breadcrumb = __.create_breadcrumb(breadcrumb, {title: 'New Menu'});
    _module.render(req, res, 'new');
};

_module.save = function (req, res, next) {
    __models.menus.create({
        name: req.body.name,
        status: 'publish'
    }).then(function (menu) {
        res.locals.menu = menu;
        next();
    }).catch(function (error) {
        req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);
        res.locals.menu = null;
        next();
    });
};

_module.read = function (req, res) {
    // Add button
    res.locals.backButton = __acl.addButton(req, route, 'index', '/admin/menus');

    // Breadcrumb
    res.locals.breadcrumb = __.create_breadcrumb(breadcrumb, {title: 'Update Menu'});
    _module.render(req, res, 'new');
};

_module.update = function (req, res) {
    __models.menus.find({
        where: {
            id: req.body.id
        }
    }).then(function (menu) {
        var menu_order = req.body.output;

        return menu.updateAttributes({
            name:req.body.name,
            menu_order: menu_order

        });
    }).then(function (menu) {
        return __models.menu_detail.destroy({
            where: {
                menu_id: menu.id
            }
        });
    }).then(function () {
        var promises = [];

        for (var i in req.body.title) {
            promises.push(
                __models.menu_detail.create({
                    id: req.body.mn_id[i],
                    menu_id: req.body.id,
                    name: req.body.title[i],
                    link: req.body.url[i],
                    status: 'publish'
                })
            );
        }

        return promise.all(promises);
    }).then(function () {
        res.redirect('/admin/menus/');
    }).catch(function () {
        req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);
        _module.render(req, res, 'new');
    });
};

_module.menuById = function (req, res, next, id) {
    __models.menus.find(id).then(function (menu) {
        res.locals.menu = menu;

        return __models.menu_detail.findAll({
            where: {
                menu_id: id
            }
        }, {raw: true});
    }).then(function (menu_details) {
        res.locals.menu_details = JSON.stringify(menu_details);
        next();
    }).catch(function () {
        req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);
        next();
    });
};

_module.delete = function (req, res) {
    __models.menus.destroy({
        where: {
            id: {
                "in": req.body.ids.split(',')
            }
        }
    }).then(function () {
        req.flash.success("Delete menu successfully");
        res.sendStatus(204);
    }).catch(function (error) {
        req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);
        res.sendStatus(200);
    });
};

_module.menuitem = function (req, res) {
    _module.render(req, res, 'menuitem');
};

util.inherits(MenusModule, BaseModuleBackend);
module.exports = _module;
