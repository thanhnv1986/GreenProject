/**
 * Created by thanhnv on 2/18/15.
 */

'use strict';

/**
 * Module dependencies.
 */
var fs = require('fs'),
    http = require('http'),
    https = require('https'),
    express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    compress = require('compression'),
    methodOverride = require('method-override'),
    cookieParser = require('cookie-parser'),
    helmet = require('helmet'),
    passport = require('passport'),
    config = require('./config'),
    redis = require("redis").createClient(),
    RedisStore = require('connect-redis')(session),
    nunjucks = require('nunjucks'),
    path = require('path');

module.exports = function () {
    // Initialize express app
    var app = express();
    // Setting application local variables
    app.locals.title = config.app.title;
    app.locals.description = config.app.description;
    app.locals.keywords = config.app.keywords;
    app.locals.facebookAppId = config.facebook.clientID;
//    app.locals.jsFiles = config.getJavaScriptAssets();
//    app.locals.cssFiles = config.getCSSAssets();

    // Passing the request url to environment locals
    app.use(function (req, res, next) {
        res.locals.url = req.protocol + '://' + req.headers.host + req.url;
        res.locals.route = req.url;
        next();
    });

    // Should be placed before express.static
    app.use(compress({
        filter: function (req, res) {
            return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
        },
        level: 9
    }));

    // Showing stack errors
    app.set('showStackError', true);

    // Set swig as the template engine
    //app.engine('html', nunjucks);
    var e = nunjucks.configure(__base + 'app/themes', {
        autoescape: true,
        express: app
    });
    //Initials custom filter
    config.getGlobbedFiles('./custom_filters/*.js').forEach(function (routePath) {
        console.log(path.resolve(routePath));
        require(path.resolve(routePath))(e);
    });

    // Set views path and view engine
    app.set('view engine', 'html');
    //app.set('views', ['./app/themes', './app/widgets']);

    // Environment dependent middleware
    if (process.env.NODE_ENV === 'development') {
        // Enable logger (morgan)
        app.use(morgan('dev'));

        // Disable views cache
        app.set('view cache', false);
    } else if (process.env.NODE_ENV === 'production') {
        app.locals.cache = 'memory';
    }

    // Request body parsing middleware should be above methodOverride
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(methodOverride());

    // CookieParser should be above session
    app.use(cookieParser());

    // Express MongoDB session storage
    var secret = "hjjhdsu465aklsdjfhasdasdf342ehsf09kljlasdf";
    app.use(session({
        store: new RedisStore({ host: 'localhost', port: 6379, client: redis }),
        secret: secret
    }));
    app.use(function (req, res, next) {
        if (!req.session) {
            return next(new Error('Session destroy')); // handle error
        }
        next(); // otherwise continue
    });
    // use passport session
    app.use(passport.initialize());
    app.use(passport.session());

    //flash messages
    app.use(require(__base+'app/plugins/flash-plugin.js'));

    // Use helmet to secure Express headers
    app.use(helmet.xframe());
    app.use(helmet.xssFilter());
    app.use(helmet.nosniff());
    app.use(helmet.ienoopen());
    app.disable('x-powered-by');

    // Setting the app router and static folder
    app.use(express.static(path.resolve('./public')));

    //module manager backend
    app.use('/admin/*',require('../app/plugins/modules-plugin.js'));
    //module manager frontend
    app.use('/^((?!admin\/).)*$',require('../app/plugins/modules-f-plugin.js'));
    app.use(require('../app/plugins/theme-plugin.js'));

    // Globbing admin module files
    redis.get('all_modules', function (err, results) {
        if (results != null) {
            global.__modules = JSON.parse(results);
        }
        else {
            config.getGlobbedFiles('./app/backend/*/module.js').forEach(function (routePath) {
                console.log(path.resolve(routePath));
                require(path.resolve(routePath))(__modules);
            });
            redis.set('all_modules', JSON.stringify(__modules), redis.print);
        }
    });
    // Globbing frontend module files
    config.getGlobbedFiles('./app/frontend/*/module.js').forEach(function (routePath) {
        console.log(path.resolve(routePath));
        require(path.resolve(routePath))(__fmodules);
    });

    // Globbing routing files
    config.getGlobbedFiles('./app/frontend/*/route.js').forEach(function (routePath) {
        console.log(path.resolve(routePath));
        require(path.resolve(routePath))(app);
    });

    // Globbing routing admin files
    config.getGlobbedFiles('./app/backend/*/route.js').forEach(function (routePath) {
        app.use('/' + config.admin_prefix, require(path.resolve(routePath)));
    });

    // Globbing menu files
    config.getGlobbedFiles('./app/menus/*/*.js').forEach(function (routePath) {
        console.log(routePath);
        require(path.resolve(routePath))(__menus);
    });

    // Assume 'not found' in the error msgs is a 404. this is somewhat silly, but valid, you can do whatever you like, set properties, use instanceof etc.
    app.use(function (err, req, res, next) {
        // If the error object doesn't exists
        if (!err) return next();

        // Log it
        console.error(err.stack);

        // Error page
        res.status(500).render('500', {
            error: err.stack
        });
    });

    // Assume 404 since no middleware responded
    app.use(function (req, res) {
        res.status(404).render('404', {
            url: req.originalUrl,
            error: 'Not Found'
        });
    });

    if (process.env.NODE_ENV === 'secure') {
        // Log SSL usage
        console.log('Securely using https protocol');

        // Load SSL key and certificate
        var privateKey = fs.readFileSync('./config/sslcerts/key.pem', 'utf8');
        var certificate = fs.readFileSync('./config/sslcerts/cert.pem', 'utf8');

        // Create HTTPS Server
        var httpsServer = https.createServer({
            key: privateKey,
            cert: certificate
        }, app);

        // Return HTTPS server instance
        return httpsServer;
    }

    // Return Express server instance
    return app;
};
