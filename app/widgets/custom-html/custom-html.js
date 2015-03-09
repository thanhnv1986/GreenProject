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

//Override save method
CustomHtml.prototype.save = function (data) {
    //Processing here
    return BaseWidget.prototype.save.call(this, data);
};

//Override save method
CustomHtml.prototype.render = function (widget) {
    //Processing here
    return new Promise(function (resolve, reject) {
        resolve(BaseWidget.prototype.render.call(this, widget, {name: 'thanh', address: 'Nguyen Khuyen'}));
    });

};

module.exports = CustomHtml;
