/**
 * Created by thanhnv on 3/18/15.
 */
var nunjucks = require('nunjucks'),
    _ = require('lodash');
var env = __.createNewEnv([__dirname + '/views_layout', __dirname + '/modules']);
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
        //env.loaders[0].searchPaths = [__dirname + '/views_layout', __dirname + '/modules' + self.path + '/views'];
        view = self.path.substring(1) + '/views/' + view;
        console.log('**********', env.loaders, view);
        env.render(view, _.assign(res.locals, options), function (err, re) {
            console.log('???????', err);
            res.send(re);
        });
    }
}

module.exports = BaseModuleBackend;
