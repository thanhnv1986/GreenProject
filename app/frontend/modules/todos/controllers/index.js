/**
 * Created by thanhnv on 2/17/15.
 */
'use strict';
/**
 * Module dependencies.
 */

let util = require('util'),
    config = require(__base + 'config/config.js'),
    _ = require('lodash');

function TodosModule() {
    BaseModuleFrontend.call(this);
    this.path = "/todos";
}
let _module = new TodosModule();
_module.index = function (req, res) {
    let index_view = 'index';
    _module.render(req, res, index_view, {
        user: req.user || null
    });
};
util.inherits(TodosModule, BaseModuleFrontend);
module.exports = _module;
