'use strict';
/**
 * Module dependencies.
 */
var init = require('./config/init')(),
    config = require('./config/config'),
    chalk = require('chalk');

global.__base = __dirname + '/';

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */



global.__modules = require('./libs/modules_manager');
global.__menus = require('./libs/menus_manager')();
global.__models = require('./libs/models_manager');
global.__acl = require('./libs/acl');
global.__ = require('./libs/global_function');

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