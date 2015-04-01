/**
 * Created by thanhnv on 3/28/15.
 */
'use strict';
module.exports = function (app, config) {
    let moduleName = 'categories';
    app.route('/_menus/' + moduleName + '/page/:page').get(function (req, res) {
        if (req.isAuthenticated()) {
            let page = req.params.page || 1;
            __models.categories.findAndCount({
                limit: config.pagination.number_item,
                offset: (page - 1) * config.pagination.number_item
            }, {raw: true}).then(function (results) {
                let totalRows = results.count;
                let items = results.rows;
                let totalPage = Math.ceil(results.count / config.pagination.number_item);
                /*let html = '<ul>';
                 for (let i in items) {
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
