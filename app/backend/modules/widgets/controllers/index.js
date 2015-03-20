/**
 * Created by thanhnv on 2/17/15.
 */
var BaseModule = require(__base + 'app/backend/base_module.js'),
    util = require('util'),
    _ = require('lodash');
var redis = require('redis').createClient();
var fs = require("fs");
var Promise = require("bluebird");
var config = require(__base + 'config/config');
var route = 'modules';

var breadcrumb =
    [
        {
            title: 'Home',
            icon: 'fa fa-dashboard',
            href: '/admin'
        },
        {
            title: 'Widgets',
            href: '/admin/widgets'
        }
    ];

function WidgetsModule() {
    BaseModule.call(this);
    this.path = "/widgets";
}
var _module = new WidgetsModule();

_module.index = function (req, res) {
    //breadcrumb
    res.locals.breadcrumb = __.create_breadcrumb(breadcrumb);
    _module.render(req, res, 'index', {
        title: "All Widgets",
        widgets: __widgets
    });
};
_module.sidebar = function (req, res, next) {
    res.locals.breadcrumb = __.create_breadcrumb(breadcrumb, {title: 'Sidebars'});
    Promise.promisifyAll(fs);
    fs.readFileAsync(__base + "app/frontend/themes/" + config.themes + "/theme.json", "utf8").then(function (data) {
        _module.render(req, res, 'sidebars', {
            title: "Sidebars",
            sidebars: JSON.parse(data).sidebars,
            widgets: __widgets
        });
    });
};
_module.addWidget = function (req, res) {
    var widget = __.getWidget(req.params.widget);
    widget.render_setting(req.params.widget).then(function (re) {
        res.send(re);
    });
}
_module.saveWidget = function (req, res) {
    console.log(req.body);
    var widget_type = req.body.widget;
    var widget = __.getWidget(widget_type);
    widget.save(req.body).then(function (id) {
        res.send(id);
    });
}
_module.read = function (req, res) {
    __models.widgets.find(req.params.cid).then(function (widget) {
        var widget = __.getWidget(widget.widget_type);
        widget.render_setting(req, res, widget.widget_type, widget).then(function (re) {
            res.send(re);
        });
    });
}
_module.delete = function (req, res) {
    __models.widgets.destroy({where: {id: req.params.cid}}).then(function () {
        res.sendStatus(200);
    });
}
_module.sidebar_sort = function (req, res) {
    console.log(req.body);
    var ids = req.body.ids.split(',');
    var sidebar = req.body.sidebar;
    var index = 1;
    var promises = [];
    for (var i in ids) {
        if (ids[i] == '') {
            index++;
            continue;
        }
        promises.push(__models.sequelize.query("Update "+__models.widgets.getTableName()+" set ordering=?, sidebar=? where id=?",
            {replacements: [index++, sidebar, ids[i]]}));
    }
    Promise.all(promises).then(function (results) {
        res.sendStatus(200);
    });

};

util.inherits(WidgetsModule, BaseModule);
module.exports = _module;