/**
 * Created by thanhnv on 2/17/15.
 */
'use strict';
/**
 * Module dependencies.
 */

var util = require('util'),
    config = require(__base + 'config/config.js'),
    _ = require('lodash');

function IndexModule() {
    BaseModuleFrontend.call(this);
    this.path = "/index";
}
var _module = new IndexModule();
_module.index = function (req, res) {
    var index_view = 'index';
    _module.render(req, res, index_view, {
        user: req.user || null
    });
};
util.inherits(IndexModule, BaseModuleFrontend);
module.exports = _module;
