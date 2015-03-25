var promise = require('bluebird');

var config = require(__base + 'config/config.js');
var slug = require('slug');

var route = 'blog';

var breadcrumb =
    [
        {
            title: 'Home',
            icon: 'fa fa-dashboard',
            href: '/admin/'
        },
        {
            title: 'Blog',
            href: '/admin/blog/'
        },
        {
            title: 'All Posts',
            href: '/admin/blog/posts/'
        }
    ];

function BlogModule() {
    BaseModuleBackend.call(this);
    this.path = "/blog";
}
var _module = new BlogModule();

exports.index = function (req, res) {
    // Create breadcrumb
    res.locals.breadcrumb = __.create_breadcrumb(breadcrumb);

    // Add buttons
    res.locals.createButton = __acl.addButton(req, route, 'post_create', '/admin/blog/posts/create');
    res.locals.deleteButton = __acl.addButton(req, route, 'post_delete');

    // Get current page and default sorting
    var page = req.params.page || 1;
    var column = req.params.sort || 'created_by';
    var order = req.params.order || 'desc';
    res.locals.root_link = '/admin/blog/posts/page/' + page + '/sort';

    // Create filter
    var filter = __.createFilter(req, res, route, '/admin/blog/posts', column, order, [
        {
            column: "id",
            width: '1%',
            header: "",
            type: 'checkbox'
        },
        {
            column: 'title',
            width: '25%',
            header: 'Title',
            link: '/admin/blog/posts/edit/{id}',
            acl: 'blog.post_edit',
            filter: {
                data_type: 'string'
            }
        },
        {
            column: 'alias',
            width: '25%',
            header: 'Slug',
            filter: {
                data_type: 'string'
            }
        },
        {
            column: 'user.display_name',
            width: '20%',
            header: 'Author',
            filter: {
                data_type: 'string'
            }
        },
        {
            column: 'created_at',
            width: '15%',
            header: 'Create Date',
            type: 'datetime',
            filter: {
                data_type: 'datetime'
            }
        },
        {
            column: 'published',
            width: '10%',
            header: 'Status',
            filter: {
                type: 'select',
                filter_key: 'published',
                data_source: [
                    {
                        name: 'publish',
                        value: 1
                    },
                    {
                        name: 'un-publish',
                        value: 0
                    }
                ],
                display_key: 'name',
                value_key: 'value'
            }
        }
    ], " AND type='post' ");

    // List posts
    __models.posts.findAndCountAll({
        include: [
            {
                model: __models.user, attribute: ['display_name']
            }
        ],
        where: filter.values,
        order: column + " " + order,
        limit: config.pagination.number_item,
        offset: (page - 1) * config.pagination.number_item
    }).then(function (results) {
        var totalPage = Math.ceil(results.count / config.pagination.number_item);

        // Render view
        _module.render(req, res, '/posts/index.html', {
            title: "All Posts",
            totalPage: totalPage,
            items: results.rows,
            currentPage: page
        });
    });
};

exports.create = function (req, res) {
    // Create breadcrumb
    res.locals.breadcrumb = __.create_breadcrumb(breadcrumb, {title: 'New Post'});

    // Add buttons
    res.locals.saveButton = __acl.addButton(req, route, 'post_edit');
    res.locals.backButton = '/admin/blog/posts/';

    // Find all categories
    __models.categories.findAll({
        order: 'name ASC',
        where: 'id <> 1 AND published = 1'
    }).then(function (categories) {
        // Get categories tree
        var categoryTree = [];
        for (var i in categories) {
            if (categories.hasOwnProperty(i) && categories[i].id == 1) {
                categoryTree.push(categories[i]);
                break;
            }
        }
        categories = getCategoriesTree(1, categories);
        categoryTree = categoryTree.concat(categories);

        _module.render(req, res, '/posts/new.html', {
            title: "New Post",
            categories: categoryTree,
            seo_enable: __seo_enable
        });
    });
};

exports.saveCreate = function (req, res) {
    var data = req.body;

    // Generate alias
    if (data.alias == undefined || data.alias == '') {
        data.alias = data.title;
    }
    data.alias = slug(data.alias.toLowerCase());

    // Set type
    data.type = 'post';

    // Save author
    data.created_by = req.user.id;

    // Save post
    __models.posts.create(data).then(function (post) {
        req.flash.success('New post was created successfully');
        res.redirect('/admin/blog/posts/edit/' + post.id);
    }).catch(function (error) {
        if (error.name == 'SequelizeUniqueConstraintError') {
            req.flash.error('Post alias was duplicated');
        } else {
            req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);
        }
        res.redirect('/admin/blog/posts/');
    });
};

exports.edit = function (req, res) {
    // Create breadcrumb
    res.locals.breadcrumb = __.create_breadcrumb(breadcrumb, {title: 'Update Post'});

    // Add buttons
    res.locals.saveButton = __acl.addButton(req, route, 'post_edit');
    res.locals.backButton = '/admin/blog/posts/';

    promise.all(
            [
                // Find all categories
                __models.categories.findAll({
                    where: 'id <> 1 AND published = 1',
                    order: 'name ASC'
                }),

                // Find post to edit
                __models.posts.find(req.params.cid)
            ]
        ).then(function (results) {
            var categories = results[0];
            var post = results[1];

            // Get categories tree
            var categoryTree = [];
            for (var i in categories) {
                if (categories.hasOwnProperty(i) && categories[i].id == 1) {
                    categoryTree.push(categories[i]);
                    break;
                }
            }
            categories = getCategoriesTree(1, categories);
            categoryTree = categoryTree.concat(categories);

            // Render view
            _module.render(req, res, '/posts/new.html', {
                title: "Update Post",
                categories: categoryTree,
                post: post,
                categories_text: post.categories,
                seo_info: post.seo_info,
                seo_enable: __seo_enable
            });
        }).catch(function (error) {
            req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);

            // Render view
            _module.render(req, res, '/posts/new.html', {
                title: "Update Post",
                categories: null,
                category: null,
                categories_text: null,
                seo_info: null,
                seo_enable: __seo_enable
            });
        });
};

exports.saveEdit = function (req, res) {
    // Get post data
    var data = req.body;

    __models.posts.find(req.params.cid).then(function (post) {
        // Generate alias
        if (data.alias == undefined || data.alias == '') {
            data.alias = data.title;
        }
        data.alias = slug(data.alias.toLowerCase());

        // Set type
        data.type = 'post';

        // Save Editor
        data.modified_by = req.user.id;

        // Save post
        return post.updateAttributes(data);
    }).then(function (post) {
        req.flash.success('Post was updated successfully');
        res.redirect('/admin/blog/posts/edit/' + post.id);
    }).catch(function (error) {
        if (error.name == 'SequelizeUniqueConstraintError') {
            req.flash.error('Post alias was duplicated');
        } else {
            req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);
        }
        res.redirect('/admin/blog/posts/edit/' + req.params.cid);
    });
};

exports.deleteRecord = function (req, res) {
    __models.posts.destroy({
        where: {
            id: {
                "in": req.body.ids.split(',')
            }
        }
    }).then(function () {
        req.flash.success("Delete post(s) successfully");
        res.send(204);
    }).catch(function (error) {
        req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);
        res.sendStatus(200);
    });
};

// Add prefix to string
var StringUtilities = {
    repeat: function (str, times) {
        str = (str == null) ? '—' : str;
        return (new Array(times + 1)).join(str);
    }
};

function getCategoriesTree(id, categories) {
    var categoriesTree = [];
    for (var index in categories) {
        // Get children of category with id
        if (categories.hasOwnProperty(index) && categories[index].parent == id) {
            var category = categories[index];
            // Add prefix '-' to category name
            category.name = StringUtilities.repeat(null, parseInt(category.level) - 1) + " " + category.name;

            // Add category to array
            categoriesTree.push(category);


            // Recursion to get categories tree
            categoriesTree = categoriesTree.concat(getCategoriesTree(category.id, categories));
        }
    }
    return categoriesTree;
}