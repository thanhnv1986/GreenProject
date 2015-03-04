/**
 * Created by thanhnv on 2/17/15.
 */
var Promise = require('bluebird');
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
    //Them button
    res.locals.createButton = __acl.addButton(req, route, 'create');
    res.locals.deleteButton = __acl.addButton(req, route, 'delete');
    //breadcrumb
    res.locals.breadcrumb = __.create_breadcrumb(breadcrumb);

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
    //breadcrumb
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
    });
};
exports.read = function (req, res) {
    res.locals.saveButton = __acl.addButton(req, route, 'create');
    res.locals.backButton = route;
    res.locals.breadcrumb = __.create_breadcrumb(breadcrumb, {title: 'Update Menu'});
    res.render('menus/new');
};
exports.update = function (req, res) {

    __models.menus.find(req.body.id).then(function (menu) {
        var menu_order = req.body.output;
        menu.updateAttributes({
            menu_order: menu_order,
            root_ul_cls:req.body.root_ul_cls,
            li_cls:req.body.li_cls,
            li_active_cls:req.body.li_active_cls,
            a_cls:req.body.a_cls,
            a_active_cls:req.body.a_active_cls,
            sub_ul_cls:req.body.sub_ul_cls,
            sub_li_cls:req.body.sub_li_cls,
            sub_a_cls:req.body.sub_a_cls
        });
        __models.menu_detail.destroy({
            where: {
                menu_id: menu.id
            }
        }).then(function () {

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
            Promise.all(promises).then(function () {
                res.redirect('/admin/menus');
            });
        });

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

exports.delete = function (req, res) {
    __models.role.destroy({
        where: {
            id: {
                "in": req.body.ids.split(',')
            }
        }
    }).then(function () {
        res.send(200);
    });
};


exports.menuitem = function (req, res) {
    res.render('menus/menuitem');
};