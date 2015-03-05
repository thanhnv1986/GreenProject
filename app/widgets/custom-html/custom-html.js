/**
 * Created by thanhnv on 2/17/15.
 */
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

module.exports.add = function () {
    _this.html = '';
    _this.html += '<form>' +
        '<input class="form-control" type="hidden" id="id" name="id" value="' + _this.options.id + '"> </div>' +
        '<div class="form-group">' +
        '<label>Title</label>' +
        '<input class="form-control" type="text" id="title" name="title" value="' + __this.options.title + '"> </div>' +
        '<div class="form-group">' +
        '<label>Content</label>' +
        '<textarea class="form-control" id="content" name="content">' + _this.options.content + '</textarea> </div>' +
        '</form>'
};

module.exports.save = function (done) {
    console.log("Widget save");
    if (this.options.id != '') {
        __models.widgets.find(this.options.id).then(function (widget) {
            __models.widget.updateAttributes({
                sidebar:this.options.sidebar,
                data:JSON.stringify({
                    title:this.options.title,
                    content:this.options.content
                })
            }).then(function (widget) {
                done();
            });
        });

    } else {
        __models.widgets.create({
            id: new Date().getTime(),
            sidebar:this.options.sidebar,
            data:JSON.stringify({
                title:this.options.title,
                content:this.options.content
            })
        }).then(function (widget) {
            done();
        });
    }

};

module.exports.remove = function () {

};

module.exports.handle = function () {

}
