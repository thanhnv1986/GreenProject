"use strict"
let promise = require('bluebird');

let config = require(__base + 'config/config.js');
let slug = require('slug');

let route = 'blog';

let breadcrumb =
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
            title: 'All Pages',
            href: '/admin/blog/pages/'
        }
    ];

function BlogModule() {
    BaseModuleBackend.call(this);
    this.path = "/blog";
}
let _module = new BlogModule();

exports.index = function (req, res) {
    // Create breadcrumb
    res.locals.breadcrumb = __.create_breadcrumb(breadcrumb);

    // Add buttons
    res.locals.createButton = __acl.addButton(req, route, 'page_create', '/admin/blog/pages/create');
    res.locals.deleteButton = __acl.addButton(req, route, 'page_delete');

    // Get current page and default sorting
    let page = req.params.page || 1;
    let column = req.params.sort || 'created_by';
    let order = req.params.order || 'desc';
    res.locals.root_link = '/admin/blog/pages/page/' + page + '/sort';

    // Create filter
    let filter = __.createFilter(req, res, route, '/admin/blog/pages', column, order, [
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
            link: '/admin/blog/pages/edit/{id}',
            acl: 'blog.page_edit',
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
            type: 'custom',
            alias: {
                "1": "Publish",
                "0": "Unpublish"
            },
            filter: {
                type: 'select',
                filter_key: 'published',
                data_source: [
                    {
                        name: 'Publish',
                        value: 1
                    },
                    {
                        name: 'Unpublish',
                        value: 0
                    }
                ],
                display_key: 'name',
                value_key: 'value'
            }
        }
    ], " AND type='page' ");

    // List pages
    __models.posts.findAndCountAll({
        include: [
            {
                model: __models.user, attributes: ['display_name'],
                where: '1 = 1',
                required: false
            }
        ],
        where: filter.values,
        order: column + " " + order,
        limit: config.pagination.number_item,
        offset: (page - 1) * config.pagination.number_item
    }).then(function (results) {
        let totalPage = Math.ceil(results.count / config.pagination.number_item);

        // Render view
        _module.render(req, res, '/pages/index.html', {
            title: "All Pages",
            totalPage: totalPage,
            items: results.rows,
            currentPage: page
        });
    }).catch(function (error) {
        req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);

        // Render view if has error
        _module.render(req, res, '/pages/index.html', {
            title: "All Pages",
            totalPage: 1,
            items: null,
            currentPage: page
        });
    });
};

exports.create = function (req, res) {
    // Create breadcrumb
    res.locals.breadcrumb = __.create_breadcrumb(breadcrumb, {title: 'New Page'});

    // Add buttons
    res.locals.saveButton = __acl.addButton(req, route, 'page_edit');
    res.locals.backButton = '/admin/blog/pages/';

    // Render view
    _module.render(req, res, '/pages/new.html', {
        title: "New Page",
        seo_enable: __seo_enable
    });
};

exports.saveCreate = function (req, res) {
    let data = req.body;

    // Generate alias
    if (data.alias == undefined || data.alias == '') {
        data.alias = data.title;
    }
    data.alias = slug(data.alias.toLowerCase());

    // Set type
    data.type = 'page';

    // Save author
    data.created_by = req.user.id;

    // Save page
    __models.posts.create(data).then(function (page) {
        req.flash.success('New page was created successfully');

        // Redirect to edit page
        res.redirect('/admin/blog/pages/edit/' + page.id);
    }).catch(function (error) {
        if (error.name == 'SequelizeUniqueConstraintError') {
            req.flash.error('Page alias was duplicated');
        } else {
            req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);
        }

        // Re-render view if has error
        res.locals.breadcrumb = __.create_breadcrumb(breadcrumb, {title: 'New Page'});
        res.locals.saveButton = __acl.addButton(req, route, 'page_edit');
        res.locals.backButton = '/admin/blog/pages/';
        _module.render(req, res, '/pages/new.html', {
            title: "New Page",
            seo_enable: __seo_enable,
            page: data
        });
    });
};

exports.edit = function (req, res) {
    // Create breadcrumb
    res.locals.breadcrumb = __.create_breadcrumb(breadcrumb, {title: 'Update Page'});

    // Add buttons
    res.locals.saveButton = __acl.addButton(req, route, 'page_edit');
    res.locals.backButton = '/admin/blog/pages/';

    // Find page to edit
    __models.posts.find(req.params.cid).then(function (page) {
        // Render view
        _module.render(req, res, '/pages/new.html', {
            title: "Update Page",
            page: page,
            seo_info: page.seo_info,
            seo_enable: __seo_enable
        });
    }).catch(function (error) {
        req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);

        // Render view if has error
        _module.render(req, res, '/pages/new.html', {
            title: "Update Page",
            page: null,
            seo_info: null,
            seo_enable: __seo_enable
        });
    });
};

exports.saveEdit = function (req, res) {
    // Get post data
    let data = req.body;

    // Find page by id
    __models.posts.find(req.params.cid).then(function (page) {
        // Generate alias
        if (data.alias == undefined || data.alias == '') {
            data.alias = data.title;
        }
        data.alias = slug(data.alias.toLowerCase());

        // Set type
        data.type = 'page';

        // Save Editor
        data.modified_by = req.user.id;

        // Save page
        return page.updateAttributes(data);
    }).then(function (page) {
        req.flash.success('Page was updated successfully');

        // Redirect to edit page
        res.redirect('/admin/blog/pages/edit/' + page.id);
    }).catch(function (error) {
        if (error.name == 'SequelizeUniqueConstraintError') {
            req.flash.error('Page alias was duplicated');
        } else {
            req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);
        }

        // Re-render view if has error
        res.locals.breadcrumb = __.create_breadcrumb(breadcrumb, {title: 'Update Page'});
        res.locals.saveButton = __acl.addButton(req, route, 'page_edit');
        res.locals.backButton = '/admin/blog/pages/';
        _module.render(req, res, '/pages/new.html', {
            title: "Update Page",
            page: data,
            seo_info: data.seo_info,
            seo_enable: __seo_enable
        });
    });
};

exports.deleteRecord = function (req, res) {
    // Delete posts by array of ids
    __models.posts.destroy({
        where: {
            id: {
                "in": req.body.ids.split(',')
            }
        }
    }).then(function () {
        req.flash.success("Delete page(s) successfully");
        res.send(204);
    }).catch(function (error) {
        req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);
        res.sendStatus(200);
    });
};
