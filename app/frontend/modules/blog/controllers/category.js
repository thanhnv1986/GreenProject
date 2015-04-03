'use strict';

let _ = require('lodash'),
    config = require(__base + 'config/config.js'),
    promise = require('bluebird');

function BlogModule() {
    BaseModuleFrontend.call(this);
    this.path = "/blog";
}
let _module = new BlogModule();

module.exports.index = function (req, res) {
    // Find category by alias
    __models.categories.find({
        where: {
            alias: req.params.alias,
            published: 1
        }
    }).then(function (category) {
        if (category) {
            // Get page
            let page = req.params.page;
            if (page == undefined) {
                page = 1;
            }

            promise.all(
                [
                    // Find all posts by categories
                    __models.posts.findAndCountAll({
                        include: [
                            {
                                model: __models.user,
                                attributes: ['id', 'display_name', 'user_login', 'user_email', 'user_image_url']
                            }
                        ],
                        attributes: ['id', 'categories', 'alias', 'title', 'intro_text', 'full_text', 'image', 'created_by', 'created_at'],
                        where: "type = 'post' AND categories LIKE '%:" + category.id + ":%'",
                        order: "posts.id desc",
                        limit: config.pagination.number_item,
                        offset: (page - 1) * config.pagination.number_item
                    }, {raw: true}),

                    // Find all categories
                    __models.categories.findAndCountAll({
                        attributes: ['id', 'parent', 'alias', 'name', 'description'],
                        where: "published = 1 AND id <> 1",
                        order: "id,parent ASC"
                    }, {raw: true})
                ]
            ).then(function (results) {
                    let totalPage = Math.ceil(results[0].count / config.pagination.number_item);

                    // Render view
                    _module.render(req, res, 'category.html', {
                        totalPage: totalPage,
                        category: category,
                        currentPage: page,
                        posts: results[0].rows,
                        categories: results[1].rows,
                        _breadcrumb: [
                            {
                                title: category.name,
                                link: '/category/' + category.alias + '/'
                            }
                        ]
                    });
                });
        } else {
            res.redirect('/');
        }
    });
};