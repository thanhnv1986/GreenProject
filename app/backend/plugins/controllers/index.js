/**
 * Created by thanhnv on 2/17/15.
 */
var redis = require('redis').createClient();
var fs = require('fs');
var route = 'modules';
var breadcrumb =
    [
        {
            title: 'Home',
            icon: 'fa fa-dashboard',
            href: '/admin'
        },
        {
            title: 'Plugins',
            href: '/admin/plugins'
        }
    ];

exports.index = function (req, res) {
    // Breadcrumb
    res.locals.breadcrumb = __.create_breadcrumb(breadcrumb);
    res.render('plugins/index', {
        title: "All Plugins",
        plugins: __pluginManager.plugins
    });
};
exports.setting = function (req, res) {
    // Breadcrumb
    res.locals.breadcrumb = __.create_breadcrumb(breadcrumb, {title: req.params.alias});
    var plg = __pluginManager.getPlugin(req.params.alias);
    if (fs.existsSync(__base + 'app/plugins/' + req.params.alias + '/setting.html')) {
        var env = __.createNewEnv([__base + 'app/plugins/' + req.params.alias]);
        env.render('setting.html', {
            title: "Setting Plugins",
            plugin: plg
        }, function (err, re) {
            if (err) {
                res.send(err);
            }
            else {
                res.render('plugins/setting.html', {setting_form: re, plugin: plg});
            }

        });
    }
    else {
        res.render('plugins/setting.html', {plugin: plg});
    }


};
exports.save_setting = function (req, res, next) {
    var plg = __pluginManager.getPlugin(req.params.alias);
    plg.options = req.body;
    redis.set('all_plugins', JSON.stringify(__pluginManager.plugins), redis.print);
    req.flash.success("Saved success");
    next();
};

exports.active = function (req, res, next) {
    var plg = __pluginManager.getPlugin(req.params.alias);
    plg.active = !plg.active;
    redis.set('all_plugins', JSON.stringify(__pluginManager.plugins), redis.print);
    next();
};

exports.reload = function (req, res, next) {
    var md = require(__base + 'libs/plugins_manager.js');
    md.loadAllModules();
    req.flash.success("Reload all plugins");
    next();
};