"use strict"
/**
 * Created by thanhnv on 3/18/15.
 */
let debug = require('debug')("BaseModule Front End");

let nunjucks = require('nunjucks'),
    fs = require('fs'),
    config = require(__base + 'config/config'),
    _ = require('lodash');
let env = __.createNewEnv([__dirname + '/themes', __dirname + '']);
function BaseModule() {

    this.render = function (req, res, view, options) {
        let self = this;
        debug('############ Begin render #############');
        //get messages from session
        res.locals.messages = req.session.messages;
        //clear session messages
        req.session.messages = [];
        if (view.indexOf('.html') == -1) {
            view += '.html';
        }
        let tmp = config.themes + '/_modules/' + self.path + '/' + view;
        if (fs.existsSync(__base + 'app/frontend/themes/' + tmp)) {
            env.loaders[0].searchPaths = [__dirname + '/themes'];
            view = config.themes + '/_modules' + self.path + '/' + view;
        }
        else {
            env.loaders[0].searchPaths = [__dirname + '/themes', __dirname + '/modules'];
            view = self.path + '/views/' + view;
        }
        //console.log('*************', env.loaders, view, tmp);
        env.render(view, _.assign(res.locals, options), function (err, re) {
            if (err) {
                console.log('??????????', err, env.loaders);
                return res.send(err.stack);
            }

            res.send(re);
            debug('############ End render #############');
        });
    };

    let render_error = function (req, res, view) {
        let self = this;
        //get messages from session
        res.locals.messages = req.session.messages;
        //clear session messages
        req.session.messages = [];
        if (view.indexOf('.html') == -1) {
            view += '.html';
        }
        env.loaders[0].searchPaths = [__dirname + '/themes', __dirname + '/themes/' + config.themes];
        env.render(view, _.assign(res.locals, options), function (err, re) {
            res.send(re);
        });
    };
    this.render404 = function (req, res) {
        render_error(req, res, '404');
    };
    this.render500 = function (req, res) {
        render_error(req, res, '500');
    };

}

module.exports = BaseModule;
