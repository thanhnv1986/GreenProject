/**
 * Created by thanhnv on 2/17/15.
 */
var BaseModule = require(__base + 'app/backend/base_module.js'),
    util = require('util'),
    _ = require('lodash');
var redis = require('redis').createClient();
var route = 'modules';
var breadcrumb =
    [
        {
            title: 'Home',
            icon: 'fa fa-dashboard',
            href: '/admin'
        },
        {
            title: 'Modules',
            href: '/admin/modules'
        }
    ];
function ModulesModule() {
    BaseModule.call(this);
    this.path = "/modules";
}
var _module = new ModulesModule();

_module.index = function (req, res) {
    // Breadcrumb
    res.locals.breadcrumb = __.create_breadcrumb(breadcrumb);
    _module.render(req, res, 'index', {
        title: "All Modules",
        modules: __modules
    });
};

_module.active = function (req, res) {
    if (__modules[req.params.route].active == undefined || __modules[req.params.route].active == false) {
        req.flash.success('Module ' + req.params.route + ' has active');
        __modules[req.params.route].active = true;
    }
    else {
        req.flash.error('Module ' + req.params.route + ' has un-active');
        __modules[req.params.route].active = false;
    }

    redis.set('all_modules', JSON.stringify(__modules), redis.print);
    return res.redirect('/admin/modules');
};

_module.reload = function (req, res, next) {
    var md = require(__base + 'libs/modules_backend_manager.js');
    md.loadAllModules();
    req.flash.success("Reload all modules");
    next();
};

util.inherits(ModulesModule, BaseModule);
module.exports = _module;
