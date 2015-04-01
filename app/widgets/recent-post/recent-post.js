"use strict"
var BaseWidget = require('../base_widget'),
    util = require('util'),
    _ = require('lodash'),
    Promise = require('bluebird');



function RecentPost() {
    let _base_config = {
        alias: "recent-post",
        name: "Recent post",
        description: "Recent post",
        author: "Robin",
        version: "0.1.0",
        options: {
            id: '',
            title: '',
            text_ids: '',
            number_to_show: ''
        }
    };
    RecentPost.super_.call(this);
    _.assign(this, _base_config);
    this.files = BaseWidget.prototype.getAllLayouts.call(this, _base_config.alias);
}
util.inherits(RecentPost, BaseWidget);

RecentPost.prototype.save = function (data, done) {
    if (data.text_ids.length > 0) {
        let ids = data.text_ids.split(',');

        if (ids.length > 0) {
            for (let i = 0; i < ids.length; i++) {
                ids[i] = parseInt(ids[i]);
            }
        }

        data.text_ids = ids.join(',');
    } else {
        data.text_ids = '';
    }
    return BaseWidget.prototype.save.call(this, data, done);
};

RecentPost.prototype.render = function (widget) {
    let _this = this;
    return new Promise(function (resolve) {
        let conditions = "type = 'post'";

        if (widget.data.text_ids != '') {
            let ids = widget.data.text_ids.split(',');
            let new_ids = ids.map(function (item, i) {
                return 'categories LIKE \'%:' + item + ':%\'';
            });
            conditions = "(" + new_ids.join(' OR ') + ") AND type = 'post'";
        }

        let limit = 5;
        if(!isNaN(parseInt(widget.data.number_to_show))){
            limit = widget.data.number_to_show;
        }

        __models.posts.findAll({
            order: "published_at DESC",
            attributes: ['title', 'alias', 'id', 'published_at'],
            where: conditions,
            limit: limit
        }).then(function (posts) {
            resolve(BaseWidget.prototype.render.call(_this, widget, {items: posts}));
        });
    });
};

module.exports = RecentPost;
