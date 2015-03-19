/**
 * Created by thanhnv on 3/4/15.
 */

var BaseModule = require(__base + 'app/backend/base_module.js'),
    util = require('util'),
    _ = require('lodash');
var config = require(__base + 'config/config');

var breadcrumb =
    [
        {
            title: 'Home',
            icon: 'fa fa-dashboard',
            href: '/admin'
        },
        {
            title: 'Configurations',
            href: '/admin/configurations'
        },
        {
            title: 'Themes',
            href: '/admin/configurations/themes'
        }
    ];


function ConfigurationsThemesModule() {
    BaseModule.call(this);
    this.path = "/configurations";
}
var _module = new ConfigurationsThemesModule();


_module.index = function (req, res) {
    // Breadcrumb
    res.locals.breadcrumb = __.create_breadcrumb(breadcrumb);

    var themes = [];

    config.getGlobbedFiles(__base + 'app/frontend/themes/*/theme.json').forEach(function (filePath) {
        themes.push(require(filePath));
    });

    for (var i in themes) {
        if (themes[i].alias.toLowerCase() == config.themes.toLowerCase()) {
            var current_theme = __current_theme = themes[i];
        }
    }

    _module.render(req, res, 'themes/index', {
        themes: themes,
        current_theme: current_theme
    });
};

_module.detail = function (req, res) {
    // Breadcrumb
    res.locals.breadcrumb = __.create_breadcrumb(breadcrumb, {title: req.params.themeName});

    var themes = [];

    config.getGlobbedFiles(__base + 'app/frontend/themes/*/theme.json').forEach(function (filePath) {
        themes.push(require(filePath));
    });

    for (var i in themes) {
        if (themes[i].name.toLowerCase() == req.params.themeName) {
            var current_theme = __current_theme = themes[i];
        }
    }

    _module.render(req, res, 'themes/detail', {
        current_theme: current_theme
    });
};

_module.change_themes = function (req, res) {
    config.themes = req.params.themeName;
    redis.set(config.key, JSON.stringify(config), redis.print);
    res.send("OK");
};

_module.delete = function (req, res) {
    res.send("ok")
};

_module.import = function (req, res) {
    res.send("ok")
};

util.inherits(ConfigurationsThemesModule, BaseModule);
module.exports = _module;
