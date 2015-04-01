'use strict';

let _ = require('lodash'),
    config = require(__base + 'config/config.js');

function BlogModule() {
    BaseModuleFrontend.call(this);
    this.path = "/blog";
}
let _module = new BlogModule();

module.exports.index = function (req, res) {
    // Get page
    let page = req.params.page;
    if (page == undefined) {
        page = 1;
    }

    // Get date
    let date = req.params.year + '-' + req.params.month;

    // Find all posts by date
    __models.posts.findAndCountAll({
        include: [
            {
                model: __models.user,
                attributes: ['id', 'display_name', 'user_login', 'user_email', 'user_image_url']
            }
        ],
        attributes: ['id', 'categories', 'alias', 'title', 'intro_text', 'full_text', 'image', 'created_by', 'created_at'],
        where: "type = 'post' AND ConCat(to_char(\"posts\".\"created_at\", 'YYYY-MM')) = '" + date + "'",
        order: "posts.id desc",
        limit: config.pagination.number_item,
        offset: (page - 1) * config.pagination.number_item
    }).then(function (posts) {
        let totalPage = Math.ceil(posts.count / config.pagination.number_item);

        // Render view
        _module.render(req, res, 'archives.html', {
            totalPage: totalPage,
            archives_date: date,
            currentPage: page,
            posts: posts.rows
        });
    }).catch(function (err) {
        res.redirect('/');
    });
};
