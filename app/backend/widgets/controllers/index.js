/**
 * Created by thanhnv on 2/17/15.
 */
var redis = require('redis').createClient();
var fs = require("fs");
var Promise = require("bluebird");
var _ = require('lodash');
var config = require(__base + 'config/config');
var route = 'modules';
// Loads templates from the "views" folder
var nunjucks = require('nunjucks');
var env = new nunjucks.Environment(new nunjucks.FileSystemLoader(__base + 'app/widgets'));

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
exports.index = function (req, res) {
    //breadcrumb
    res.locals.breadcrumb = __.create_breadcrumb(breadcrumb);
    res.render('widgets/index', {
        title: "All Widgets",
        widgets: __widgets
    });
};
exports.sidebar = function (req, res, next) {
    res.locals.breadcrumb = __.create_breadcrumb(breadcrumb, {title: 'Sidebars'});
    Promise.promisifyAll(fs);
    fs.readFileAsync(__base + "app/themes/" + config.themes + "/theme.json", "utf8").then(function (data) {
        console.log(JSON.parse(data).sidebars);
        res.render('widgets/sidebars', {
            title: "Sidebars",
            sidebars: JSON.parse(data).sidebars,
            widgets: __widgets
        });
    });
};
exports.addWidget = function (req, res) {

    env.render(req.params.widget + '/setting.html', function (err, re) {
        res.send(re);
    });
}
exports.saveWidget = function (req, res) {
    console.log(req.body);
    var widget = req.body.widget;
    for (var i in __widgets) {
        if (__widgets[i].alias == widget) {
            widget = _.clone(__widgets[i]);
            _.assign(widget.options, req.body);
            break;
        }
    }
    widget.save(function () {
        res.sendStatus(200);
    });
}
exports.read = function (req, res) {
    __models.widgets.find(req.params.cid).then(function (widget) {
        env.render(widget.widget_type + '/setting.html', {widget: widget},
            function (err, re) {
                res.send(re);
            });
    });
}
