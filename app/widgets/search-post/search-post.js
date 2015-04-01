"use strict"
let BaseWidget = require('../base_widget'),
    util = require('util'),
    _ = require('lodash'),
    Promise = require('bluebird');

let _base_config = {
    alias: "search-post",
    name: "Search post",
    description: "Search post",
    author: "Robin",
    version: "0.1.0",
    options: {
        id: '',
        title: '',
        placeholder: '',
        button_name: ''
    }
};

function SearchPost() {
    SearchPost.super_.call(this);
    _.assign(this, _base_config);
    this.files = BaseWidget.prototype.getAllLayouts.call(this, _base_config.alias);
}
util.inherits(SearchPost, BaseWidget);

SearchPost.prototype.save = function (data, done) {
    if (data.button_name.length == 0) {
        data.button_name = 'Search';
    }
    return BaseWidget.prototype.save.call(this, data, done);
};

module.exports = SearchPost;
