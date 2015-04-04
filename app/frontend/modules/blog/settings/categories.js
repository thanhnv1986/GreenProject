/**
 * Created by thanhnv on 3/28/15.
 */
'use strict'
module.exports = function (app, config) {
    let alias = 'categories';

    app.route('/_menus/' + alias + '/page/:page').get(function (req, res) {
        if (req.isAuthenticated()) {
            // Get page and keyword to search
            let page = req.params.page || 1;
            let s = req.query.s;

            // Set conditions
            let conditions = "id <> 1 AND published = 1";
            if (s != '') conditions += " AND name ilike '%" + s + "%'";

            // Find all categories with page and search keyword
            __models.categories.findAndCountAll({
                attributes: ['id', 'alias', 'name'],
                where: conditions,
                limit: 10,
                offset: (page - 1) * 10
            }, {raw: true}).then(function (results) {
                let totalRows = results.count;
                let items = results.rows;
                let totalPage = Math.ceil(results.count / 10);

                // Send json response
                res.jsonp({
                    totalRows: totalRows,
                    totalPage: totalPage,
                    items: items,
                    title_column: 'name',
                    link_template: '/category/{alias}'
                });
            });
        }
        else {
            res.send("Not Authenticated");
        }
    });

    return {
        title: 'Categories',
        alias: alias,
        search: true
    };
};
