/**
 * Created by thanhnv on 2/17/15.
 */
'use strict';
/**
 * Module dependencies.
 */
var _ = require('lodash'),
    config = require(__base + 'config/config.js');
/*var _this = module.exports = _.extend(
    require('../module.js')
);*/
module.exports.index = function (req, res) {
    var index_view = 'index/index';
    res.render(index_view, {
        user: req.user || null
    });
};
module.exports.changetotheme1 = function (req, res) {
    //console.log(config.themes, _this.index_view);
    config.themes = 'default';
    res.redirect('/');
};
module.exports.changetotheme2 = function (req, res) {
    config.themes = 'my_themes';
    //console.log(config.themes, _this.index_view);
    res.redirect('/');
};
