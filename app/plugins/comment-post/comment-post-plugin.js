'use strict'
/**
 * Created by thanhnv on 3/13/15.
 */
let Promise = require('bluebird'),
    _ = require('lodash');
let _base_config = {
    alias: 'comment-post',
    name: 'Comment to Post',
    author: 'Jack',
    version: '0.1.0',
    description: 'Add comment in a Post',
    active: false,
    sync: false,
    options: {}
};
function CommentPostPlugin() {
    _.assign(this, _base_config);
    this.before_close_head_tag = function (data) {
        return new Promise(function (done, reject) {
            done('Comment post plugins');
        });
    }
}
module.exports = new CommentPostPlugin();
