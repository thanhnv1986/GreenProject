/**
 * Created by thanhnv on 3/18/15.
 */
var nunjucks = require('nunjucks'),
    _ = require('lodash');

function BaseModuleBackend() {

    this.render = function (req, res, view, options) {
        var self = this;
        //get messages from session
        res.locals.messages = req.session.messages;
        //clear session messages
        req.session.messages = [];
        if (view.indexOf('.html') == -1) {
            view += '.html';
        }
        var env = __.createNewEnv([__dirname + '/views_layout', __dirname + '/modules/' + self.path + '/views']);

        env.render(view, _.assign(res.locals, options), function (err, re) {
            res.send(re);
        });
    }
}

module.exports = BaseModuleBackend;
