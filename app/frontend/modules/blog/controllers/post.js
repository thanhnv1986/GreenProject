'use strict';
let _ = require('lodash'),
    debug = require('debug')("POST Frontend"),
    promise = require('bluebird');

function BlogModule() {
    BaseModuleFrontend.call(this);
    this.path = "/blog";
}
var _module = new BlogModule();

_module.index = function (req, res) {
    let data = null;
    promise.all(
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
                order: "id,parent ASC"
            })
        ]
    ).then(function (results) {
            data = results;
            if (data[0]) {
                // Check page or post
                if (data[0].type == 'post') {

                    // Update hit if post exist
                    return data[0].updateAttributes({
                        hit: parseInt(data[0].hit) + 1
                    });
                } else {
                    return data[0];
                }
            } else {
                // Redirect to 404 if post not exist
                _module.render404(req, res);

                return Promise.cancel();
            }
        }).then(function (results) {
            if (Array.isArray(data)) {
                // Get SEO info
                let seo_info = null;

                if (data[0].seo_info && data[0].seo_info != '') seo_info = JSON.parse(data[0].seo_info);

                // Render view
                if (data[0].type === 'post') {
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
                } else {
                    _module.render(req, res, 'page.html', {
                        item: data[0],
                        seo_info: seo_info
                    });
                }
            }
        });
    /*.catch(function (err) {
     debug('##############', err);
     res.redirect('/');
     });*/
};
module.exports = _module;