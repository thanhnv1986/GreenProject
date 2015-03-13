/**
 * Created by thanhnv on 2/20/15.
 */
var fs = require('fs');
var config = require(__base + 'config/config.js');
module.exports = function (req, res, next) {
    // grab reference of render
    var _render = res.render;
    // override logic
    res.render = function (view, options, fn) {
        //get messages from session
        res.locals.messages = req.session.messages;
        //clear session messages
        req.session.messages = [];
        //Check if is using admin view
        var route = res.locals.route.split('/')[1];
        if (route === config.admin_prefix) {
            view = 'admin/' + view;
        }
        else {
            var tmp = config.themes + '/' + view;
            if (fs.existsSync(__base + 'app/themes/' + tmp + '.html')) {
                view = tmp;
            }
            else {
                view = "default/" + view;
            }

        }
        // continue with original render
        _render.call(this, view, options, fn);
    }
    next();
}