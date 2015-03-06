/**
 * Created by thanhnv on 2/17/15.
 */
var Promise = require('bluebird');
var _this = module.exports = {
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

module.exports.save = function (done) {
    console.log("Widget save");
    if (this.options.id != '') {
        var data  = JSON.stringify({
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

module.exports.render = function (widget) {
    console.log(widget);
    return new Promise(function (resolve, reject) {
        var nunjucks = require('nunjucks');
        var env = new nunjucks.Environment(new nunjucks.FileSystemLoader(__base + 'app/widgets'));
        var renderWidget = Promise.promisifyAll(env);
        resolve(renderWidget.renderAsync(widget.widget_type + '/view.html', {widget: widget}));
    });

};

module.exports.handle = function () {

}
