/**
 * Created by thanhnv on 3/18/15.
 */
var nunjucks = require('nunjucks'),
    fs = require('fs'),
    config = require(__base + 'config/config'),
    _ = require('lodash');

function BaseModule() {

    this.render = function (req, res, view, options) {
        var self = this;
        //get messages from session
        res.locals.messages = req.session.messages;
        //clear session messages
        req.session.messages = [];
        if (view.indexOf('.html') == -1) {
            view += '.html';
        }
        var tmp = config.themes + '/_modules/' + self.path + '/' + view;

        if (fs.existsSync(__base + 'app/frontend/themes/' + tmp)) {
            var env = __.createNewEnv([__dirname + '/themes', __dirname + '/themes/' + config.themes + '/_modules/' + self.path]);
        }
        else {
            var env = __.createNewEnv([__dirname + '/themes', __dirname + '/modules/' + self.path + '/views']);
        }
        console.log(env.loaders, view, tmp);
        env.render(view, _.assign(res.locals, options), function (err, re) {
            console.log(err);
            res.send(re);
        });
    }
}

module.exports = BaseModule;
