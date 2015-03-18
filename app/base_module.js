/**
 * Created by thanhnv on 3/18/15.
 */
var nunjucks = require('nunjucks');

function BaseModule() {
    var self = this;
}

BaseModule.prototype.render = function (req, res, view, options) {
    var self = this;
    console.log('11111', self);
    console.log('@@@@@@@@@', __dirname + self.path + '/views');
    // grab reference of render

    //get messages from session
    res.locals.messages = req.session.messages;
    //clear session messages
    req.session.messages = [];
    var nunjucks = require('nunjucks');
    console.log(__dirname);
    var env = new nunjucks.Environment(new nunjucks.FileSystemLoader(__dirname + '/' + self.path + '/views'));
    console.log(env.loaders);
    env.render(view, options, function (err, re) {
        res.send(re);
    });
    // continue with original render


}

module.exports = BaseModule;
