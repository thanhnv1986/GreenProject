/**
 * Created by thanhnv on 2/17/15.
 */
var Promise = require('bluebird');
var route = 'menus';

exports.index = function (req, res) {
    //Them button
    res.locals.createButton = __acl.addButton(req, route, 'create');
    res.locals.deleteButton = __acl.addButton(req, route, 'delete');
    __models.menus.findAll().then(function (menus) {
        res.render('menus/index', {
            title: "All Menus",
            menus: menus
        });
    })

};
exports.create = function (req, res) {
    //Them button
    res.locals.saveButton = __acl.addButton(req, route, 'create');
    res.locals.backButton = route;
    res.render('menus/new');
};
exports.save = function (req, res, next) {
    __models.menus.create({
        name: req.body.name,
        status: 'publish'
    }).then(function (menu) {
        res.locals.menu = menu;
        next();
    });
};
exports.read = function (req, res) {
    res.locals.saveButton = __acl.addButton(req, route, 'create');
    res.locals.backButton = route;
    res.render('menus/new');
};
exports.update = function (req, res) {

    __models.menus.find(req.body.id).then(function (menu) {
        var menu_order = req.body.output;
        menu.updateAttributes({
            menu_order: menu_order
        });
        var promises = [];
        for (var i in req.body.title) {
            promises.push(
                __models.menu_detail.create({
                    id: req.body.mn_id[i],
                    menu_id: menu.id,
                    name: req.body.title[i],
                    link: req.body.url[i],
                    status: 'publish'
                })
            );
        }
        return Promise.all(promies);
    }).then(function (menu_details) {
        res.redirect('/admin/menus');
    });
};
exports.menuById = function (req, res, next, id) {
    __models.menus.find(id).then(function (menu) {
        res.locals.menu = menu;
        __models.menu_detail.findAll({
            where: {
                menu_id: id
            }
        }, {raw: true}).then(function (menu_details) {
            res.locals.menu_details = JSON.stringify(menu_details);
            next();
        });

    });

};
exports.menuitem = function (req, res) {
    res.render('menus/menuitem');
};