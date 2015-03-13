'use strict';
/**
 * Module dependencies.
 */
var init = require('./config/init')(),
    config = require('./config/config'),
    chalk = require('chalk');
/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */
global.__base = __dirname + '/';
global.__ = require('./libs/global_function');
global.__modules = require('./libs/modules_backend_manager.js')();
global.__f_modules = require('./libs/modules_frontend_manager.js')();
global.__menus = require('./app/menus/menus_manager')();
global.__widgets = require('./app/widgets/widgets_manager')();
global.__models = require('./libs/models_manager');
global.__acl = require('./libs/acl');
global.__messages = [];
global.__current_theme = {};



// Init the express application
var app = require('./config/app')();

// Bootstrap passport config
require('./config/passport')();

app.listen(config.port);
// Start the app by listening on <port>


// Expose app
module.exports = app;

// Logging initialization
console.log('Application started on port ' + config.port);