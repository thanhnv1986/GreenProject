/**
 * Created by thanhnv on 3/4/15.
 */
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

exports.index = function (req, res) {
    // Breadcrumb
    res.locals.breadcrumb = __.create_breadcrumb(breadcrumb);

    var themes = [];

    config.getGlobbedFiles(__base + 'app/themes/**/theme.json').forEach(function (filePath) {
        themes.push(require(filePath));
    });

    for (var i in themes) {
        if (themes[i].name.toLowerCase() == config.themes.toLowerCase()) {
            var current_theme = __current_theme = themes[i];
        }
    }

    res.render('configurations/themes/index', {
        themes: themes,
        current_theme: current_theme
    });
};

exports.detail = function (req, res) {
    // Breadcrumb
    res.locals.breadcrumb = __.create_breadcrumb(breadcrumb, {title: req.params.themeName});

    var themes = [];

    config.getGlobbedFiles(__base + 'app/themes/**/theme.json').forEach(function (filePath) {
        themes.push(require(filePath));
    });

    for (var i in themes) {
        if (themes[i].name.toLowerCase() == req.params.themeName) {
            var current_theme = __current_theme = themes[i];
        }
    }

    res.render('configurations/themes/detail', {
        current_theme: current_theme
    });
};

exports.change_themes = function (req, res) {
    config.themes = req.params.themeName;
    redis.set(config.key, JSON.stringify(config), redis.print);
    res.send("OK");
};

exports.delete = function (req, res) {
    res.send("ok")
};

exports.import = function (req, res) {
    res.send("ok")
};
