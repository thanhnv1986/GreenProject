/**
 * Created by thanhnv on 2/17/15.
 */
var
    util = require('util'),
    _ = require('lodash');

var breadcrumb =
    [
        {
            title: 'Home',
            icon: 'fa fa-dashboard',
            href: '/admin'
        },
        {
            title: 'Dashboard',
            href: '/admin/dashboard'
        }
    ];
function DashboardModule() {
    BaseModuleBackend.call(this);
    this.path = "/dashboard";
}
var _module = new DashboardModule();
_module.index = function (req, res) {
    res.locals.breadcrump = [
        {
            title: 'Home',
            icon: 'fa fa-dashboard',
            href: '/admin'
        },
        {
            title: 'Dashboard'
        }
    ];
    _module.render(req, res, 'index');
};

util.inherits(DashboardModule, BaseModuleBackend);
module.exports = _module;