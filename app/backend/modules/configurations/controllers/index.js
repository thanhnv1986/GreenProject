"use strict"
/**
 * Created by thanhnv on 2/17/15.
 */

let   util = require('util'),
    _ = require('lodash');
let config = require(__base + 'config/config');
let redis = require('redis').createClient();
let breadcrumb =
    [
        {
            title: 'Home',
            icon: 'fa fa-dashboard',
            href: '/admin'
        },
        {
            title: 'Configurations',
            href: '#'
        },
        {
            title: 'Site info',
            href: '#'
        }
    ];

function ConfigurationsModule() {
    BaseModuleBackend.call(this);
    this.path = "/configurations";
}
let _module = new ConfigurationsModule();

_module.index = function (req, res) {
    res.locals.breadcrumb = __.create_breadcrumb(breadcrumb);
    _module.render(req, res, 'sites/index', {config: config});
};
_module.update_setting = function (req, res, next) {
    let data = req.body;
    //site info
    config.app.title = data.title;
    config.app.logo = data.logo;
    config.app.icon = data.icon;
    config.pagination.number_item = data.number_item;
    //database info
    config.db.host = data.db_host;
    config.db.port = data.db_port;
    config.db.username = data.db_username;
    if (data.db_password != '') {
        config.db.password = data.db_password;
    }
    config.db.dialect = data.db_dialect;
    if (data.logging) {
        config.db.logging = true;
    }
    //redis info
    config.redis.host = data.redis_host;
    config.redis.port = data.redis_port;

    redis.set(config.key, JSON.stringify(config), redis.print);
    req.flash.success('Saved success');
    next();

};

util.inherits(ConfigurationsModule, BaseModuleBackend);
module.exports = _module;