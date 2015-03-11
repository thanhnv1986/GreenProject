/**
 * Created by thanhnv on 2/17/15.
 */

var BaseWidget = require('../base_widget'),
    util = require('util'),
    config = require(__base + 'config/config'),
    _ = require('lodash');

var _base_config = {
    alias: "menus",
    name: "Menus",
    description: "Show menu",
    author: "Nguyen Van Thanh",
    version: "0.1.0",
    options: {
        id: '',
        title: '',
        menu_id: '',
        file: ''
    }
};
function Menus() {
    Menus.super_.call(this);
    _.assign(this, _base_config);
}
util.inherits(Menus, BaseWidget);

//Override save method
Menus.prototype.render_setting = function (widget_type, widget) {
    var _this = this;
    return new Promise(function (done, err) {
        var files = [];
        config.getGlobbedFiles(__base + "app/themes/" + config.themes + '/_menus/*.html').forEach(function (path) {
            var s = path.split('/');
            files.push(s[s.length - 1]);
        });
        __models.menus.findAll({
            where: {
                status: 'publish'
            },
            order:["id"]
        }, {raw: true}).then(function (menus) {
            console.log(menus);
            _this.env.render(widget_type + '/setting.html', {
                    widget: widget,
                    menus: menus,
                    files: files
                },
                function (err, re) {
                    done(re);
                });
        });
    });
};

//Override save method
Menus.prototype.render = function (widget, route) {
    var _this = this;
    //Processing here
    return new Promise(function (resolve, reject) {
        __models.menus.find(widget.data.menu_id, {raw: true}).then(function (menu) {
            __models.menu_detail.findAll({
                where: {
                    menu_id: menu.id
                }
            }, {raw: true}).then(function (menu_details) {
                //get menu order
                var menu_order = JSON.parse(menu.menu_order);
                _this.env.render(config.themes + '/_menus/' + widget.data.file, {
                        route: route,
                        _menus: menu_order,
                        _menus_data: menu_details
                    },
                    function (err, res) {
                        resolve(res);
                    });
            });

        });
    });

};

module.exports = Menus;
