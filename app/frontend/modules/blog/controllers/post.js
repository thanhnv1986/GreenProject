'use strict';
var _ = require('lodash'),
    promise = require('bluebird');

function BlogModule() {
    BaseModuleFrontend.call(this);
    this.path = "/blog";
}
var _module = new BlogModule();

module.exports.index = function (req, res) {
    var data = null;
    var Promise = promise.all(
            [
                // Find post by alias
                __models.posts.find({
                    include: [
                        {
                            model: __models.user,
                            attributes: ['id', 'display_name', 'user_login', 'user_email', 'user_image_url']
                        }
                    ],
                    where: {
                        alias: req.params.alias
                    }
                }),

                // Find all categories
                __models.categories.findAndCountAll({
                    where: "published = 1 AND id <> 1",
                    order: "id,parents ASC"
                })
            ]
        ).then(function (results) {
            data = results;

            if (results[0]) {
                // Check page or post
                if(results[0].type == 'post'){
                    // Update hit if post exist
                    return results[0].updateAttributes({
                        hit: parseInt(results[0].hit) + 1
                    });
                }else{
                    return results[0];
                }
            } else {
                // Redirect to 404 if post not exist
                res.render404(req, res);

                return Promise.cancel();
            }
        }).then(function (results) {
            if (Array.isArray(data)) {
                // Get SEO info
                var seo_info = null;
                if (data[0].seo_info && data[0].seo_info != '') seo_info = JSON.parse(data[0].seo_info);

                // Render view
                if(data[0].type == 'post'){
                    _module.render(req, res, 'post.html', {
                        item: data[0],
                        seo_info: seo_info,
                        categories: data[1].rows,
                        _breadcrumb: [
                            {
                                title: data[0].title,
                                link: '/' + data[0].alias + '/p' + data[0].id + '/'
                            }
                        ]
                    });
                }else{
                    _module.render(req, res, 'page.html', {
                        item: data[0],
                        seo_info: seo_info
                    });
                }
            }
        }).catch(function (err) {
            res.redirect('/');
        });
};
