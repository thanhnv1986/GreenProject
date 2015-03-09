/**
 * Created by thanhnv on 2/17/15.
 */

var BaseWidget = require('../base_widget'),
    util = require('util'),
    _ = require('lodash');

var _base_config = {
    alias: "custom-html",
    name: "Custom HTML",
    description: "Create block HTML to view",
    author: "Nguyen Van Thanh",
    version: "0.1.0",
    options: {
        id: '',
        title: '',
        content: ''
    }
};
function CustomHtml() {
    CustomHtml.super_.call(this);
    _.assign(this, _base_config);
}
util.inherits(CustomHtml, BaseWidget);

CustomHtml.prototype.save = function (data, done) {
    console.log("Widget save");
    //call base _save of widget
    this._save(data, done);

    /*var data = JSON.stringify({
        title: this.options.title,
        content: this.options.content
    });
    if (this.options.id != '') {
        __models.widgets.find(this.options.id).then(function (widget) {
            widget.updateAttributes({
                sidebar: this.options.sidebar,
                widget_type: this.alias,
                data: data
            }).then(function (widget) {
                done(widget.id);
            });
        });

    } else {
        __models.widgets.create({
            id: new Date().getTime(),
            sidebar: this.options.sidebar,
            data: data
        }).then(function (widget) {
            done(widget.id);
        });
    }*/

};
CustomHtml.prototype.render = function (widget) {
    //call base _render method _render(widget,{})
    return this._render(widget);
}
module.exports = CustomHtml;
