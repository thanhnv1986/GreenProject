/**
 * Created by thanhnv on 2/17/15.
 */
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
exports.index = function (req, res) {
    //breadcrumb
    res.locals.breadcrumb = __.create_breadcrumb(breadcrumb);
    res.render('modules/index', {
        title: "All Modules",
        modules: __modules
    });


};
exports.active = function (req, res, next) {
    if (__modules[req.params.route].active == undefined || __modules[req.params.route].active == false) {
        req.flash.success('Module '+req.params.route+' has active');
        __modules[req.params.route].active = true;
    }
    else {
        req.flash.error('Module '+req.params.route+' has un-active');
        __modules[req.params.route].active = false;
    }
    redis.set('all_modules', JSON.stringify(__modules), redis.print);
    next();
};
