'use strict';

module.exports = function (app) {
    // Root routing
    var post = require('./controllers/post');
    var category = require('./controllers/category');
    var archives = require('./controllers/archives');
    var author = require('./controllers/author');
    var search = require('./controllers/search');

    // Search router
    app.route('/search/').get(search.index);

    // Categories router
    app.route('/category/:alias([0-9a-zA-Z-]+)(/)?').get(category.index);
    app.route('/category/:alias([0-9a-zA-Z-]+)/page-:page([0-9])?(/)?').get(category.index);

    // Author router
    app.route('/author\/:author([0-9a-zA-Z-]+)(/)?').get(author.index);
    app.route('/author\/:author([0-9a-zA-Z-]+)/page-:page([0-9])?(/)?').get(author.index);

    // Archive router
    app.route('/archives\/:year([0-9]{4})\/:month([0-9]{2})\/').get(archives.index);
    app.route('/archives\/:year([0-9]{4})\/:month([0-9]{2})\/page-:page([0-9])\/').get(archives.index);

    // Page + Post router
    app.route('/:alias([a-zA-Z0-9-]+)(/)?').get(post.index);
};