/**
 * Created by thanhnv on 3/28/15.
 */
'use strict';
module.exports = function (app, config) {
    var moduleName = 'categories';
    app.route('/_menus/' + moduleName + '/page/:page').get(function (req, res) {
        if (req.isAuthenticated()) {
            var page = req.params.page || 1;
            __models.categories.findAndCount({
                limit: config.pagination.number_item,
                offset: (page - 1) * config.pagination.number_item
            }, {raw: true}).then(function (results) {
                var totalRows = results.count;
                var items = results.rows;
                var totalPage = Math.ceil(results.count / config.pagination.number_item);
                /*var html = '<ul>';
                 for (var i in items) {
                 html += '<li><div class="checkbox"><label><input type="checkbox" value="' + items[i].name + '">' + items[i].name + '</label></div></li>'
                 }
                 html += '</ul>'*/
                res.jsonp({
                    totalRows: totalRows,
                    totalPage: totalPage,
                    items: items,
                    link_template:'/categories/{id}/{alias}'
                });
            });
        }
        else {
            res.send("OK");
        }

    });
    return {
        name: 'Categories',
        alias: moduleName
    };
};
