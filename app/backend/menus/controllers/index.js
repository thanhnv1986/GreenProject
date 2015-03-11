/**
 * Created by thanhnv on 2/17/15.
 */
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

exports.index = function (req, res) {
    // Add button
    res.locals.createButton = __acl.addButton(req, route, 'create', '/admin/menus/create');
    res.locals.deleteButton = __acl.addButton(req, route, 'delete');

    // Breadcrumb
    res.locals.breadcrumb = __.create_breadcrumb(breadcrumb);

    __models.menus.findAll().then(function (menus) {
        res.render('menus/index', {
            title: "All Menus",
            menus: menus
        });
    }).catch(function (error) {
        req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);
        res.render('menus/index', {
            title: "All Menus",
            menus: null
        });
    });
};

exports.create = function (req, res) {
    // Add button
    res.locals.saveButton = __acl.addButton(req, route, 'create');
    res.locals.backButton = __acl.addButton(req, route, 'index', '/admin/menus');

    // Breadcrumb
    res.locals.breadcrumb = __.create_breadcrumb(breadcrumb, {title: 'New Menu'});
    res.render('menus/new');
};

exports.save = function (req, res, next) {
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

exports.read = function (req, res) {
    // Add button
    res.locals.backButton = __acl.addButton(req, route, 'index', '/admin/menus');

    // Breadcrumb
    res.locals.breadcrumb = __.create_breadcrumb(breadcrumb, {title: 'Update Menu'});
    res.render('menus/new');
};

exports.update = function (req, res) {
    __models.menus.find({
        where: {
            id: req.body.id
        }
    }).then(function (menu) {
        var menu_order = req.body.output;

        return menu.updateAttributes({
            menu_order: menu_order,
            root_ul_cls: req.body.root_ul_cls,
            li_cls: req.body.li_cls,
            li_active_cls: req.body.li_active_cls,
            a_cls: req.body.a_cls,
            a_active_cls: req.body.a_active_cls,
            sub_ul_cls: req.body.sub_ul_cls,
            sub_li_cls: req.body.sub_li_cls,
            sub_a_cls: req.body.sub_a_cls
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
        res.render('menus/new');
    });
};

exports.menuById = function (req, res, next, id) {
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

exports.delete = function (req, res) {
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

exports.menuitem = function (req, res) {
    res.render('menus/menuitem');
};