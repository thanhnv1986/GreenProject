'use strict';

var _ = require('lodash'),
    config = require(__base + 'config/config.js'),
    promise = require('bluebird');

function BlogModule() {
    BaseModuleFrontend.call(this);
    this.path = "/blog";
}
var _module = new BlogModule();

module.exports.index = function (req, res) {
    // Get search query
    var s = req.query.s;
    if (s != undefined && s.length > 0) {
        // Get page
        var page = req.params.page;
        if (page == undefined) {
            page = 1;
        }

        promise.all(
                [
                    // Find all posts by query
                    __models.posts.findAndCountAll({
                        include: [
                            {
                                model: __models.user,
                                attributes: ['id', 'display_name', 'user_login', 'user_email', 'user_image_url']
                            }
                        ],
                        attributes: ['id', 'categories', 'alias', 'title', 'intro_text', 'full_text', 'image', 'created_by', 'created_at'],
                        where: {
                            $or: [
                                {
                                    full_text: {
                                        $like: '%' + s + '%'
                                    }
                                },
                                {
                                    intro_text: {
                                        $like: '%' + s + '%'
                                    }
                                },
                                {
                                    title: {
                                        $like: '%' + s + '%'
                                    }
                                }
                            ],
                            type: 'post'
                        },
                        order: "posts.id desc",
                        limit: config.pagination.number_item,
                        offset: (page - 1) * config.pagination.number_item
                    }),

                    // Find all categories
                    __models.categories.findAndCountAll({
                        attributes: ['id', 'parent', 'alias', 'name', 'description'],
                        where: "published = 1 AND id <> 1",
                        order: "id,parent ASC"
                    })
                ]
            ).then(function (results) {
                var totalItems = results[0].count;
                var totalPage = Math.ceil(totalItems / config.pagination.number_item);

                // Render view
                _module.render(req, res, 'search.html', {
                    totalPage: totalPage,
                    totalItems: totalItems,
                    currentPage: page,
                    posts: results[0].rows,
                    categories: results[1].rows,
                    keyword: s
                });
            }).catch(function (err) {
                res.redirect('/');
            });
    } else {
        res.redirect('/');
    }
};