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

CustomHtml.prototype.save = function (done) {
    console.log("Widget save");
    if (this.options.id != '') {
        var data = JSON.stringify({
            title: this.options.title,
            content: this.options.content
        });
        __models.widgets.find(this.options.id).then(function (widget) {
            widget.updateAttributes({
                widget_type: this.options.widget,
                data: data
            }).then(function (widget) {
                done();
            });
        });

    } else {
        __models.widgets.create({
            id: new Date().getTime(),
            sidebar: this.options.sidebar,
            data: JSON.stringify({
                title: this.options.title,
                content: this.options.content
            })
        }).then(function (widget) {
            done();
        });
    }

};

module.exports = CustomHtml;
