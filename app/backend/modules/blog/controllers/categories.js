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
            href: '/admin'
        },
        {
            title: 'Blog',
            href: '/admin/blog'
        },
        {
            title: 'All Categories',
            href: '/admin/blog/categories/'
        }
    ];

function BlogModule() {
    BaseModuleBackend.call(this);
    this.path = "/blog";
}
let _module = new BlogModule();

exports.index = function (req, res) {
    // Create Breadcrumb
    res.locals.breadcrumb = __.create_breadcrumb(breadcrumb);

    // Add buttons
    res.locals.createButton = __acl.addButton(req, route, 'category_create', '/admin/blog/categories/create/');
    res.locals.deleteButton = __acl.addButton(req, route, 'category_delete');

    // Get current page and default sorting
    let page = req.params.page || 1;
    let column = req.params.sort || 'id';
    let order = req.params.order || '';
    res.locals.root_link = '/admin/blog/categories/page/' + page + '/sort';

    // Create filter
    let filter = __.createFilter(req, res, route, '/admin/blog/categories', column, order, [
        {
            column: "id",
            width: '1%',
            header: "",
            type: 'checkbox'
        },
        {
            column: "name",
            width: '25%',
            header: "Name",
            link: '/admin/blog/categories/edit/{id}',
            acl: 'blog.category_edit',
            filter: {
                data_type: 'string'
            }
        },
        {
            column: "alias",
            width: '25%',
            header: "Slug",
            filter: {
                data_type: 'string'
            }
        },
        {
            column: "level",
            width: '10%',
            header: "Level",
            filter: {
                data_type: 'number'
            }
        },
        {
            column: "published",
            width: '10%',
            header: "Status",
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
                        name: "Publish",
                        value: 1
                    },
                    {
                        name: "Unpublish",
                        value: 0
                    }
                ],
                display_key: 'name',
                value_key: 'value'
            }
        }
    ], " AND id <> 1 ");

    // Find all categories
    __models.categories.findAndCountAll({
        where: filter.values,
        order: column + " " + order,
        limit: config.pagination.number_item,
        offset: (page - 1) * config.pagination.number_item
    }).then(function (results) {
        let totalPage = Math.ceil(results.count / config.pagination.number_item);

        // Render view
        _module.render(req, res, '/categories/index.html', {
            title: "All Categories",
            totalPage: totalPage,
            items: results.rows,
            currentPage: page
        });
    }).catch(function (error) {
        req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);

        // Render view if has error
        _module.render(req, res, '/categories/index.html', {
            title: "All Categories",
            totalPage: 1,
            items: null,
            currentPage: page
        });
    });
};

exports.create = function (req, res) {
    // Create Breadcrumb
    res.locals.breadcrumb = __.create_breadcrumb(breadcrumb, {title: 'New Category'});

    // Add buttons
    res.locals.saveButton = __acl.addButton(req, route, 'category_create');
    res.locals.backButton = "/admin/blog/categories/";

    // Find all categories
    __models.categories.findAll({
        where: {
            published: 1
        },
        order: "name ASC"
    }).then(function (categories) {
        // Get categories tree
        let categoryTree = [];
        for(let i in categories){
            if(categories.hasOwnProperty(i) && categories[i].id == 1){
                categoryTree.push(categories[i]);
                break;
            }
        }
        categories = getCategoriesTree(1, categories);
        categoryTree = categoryTree.concat(categories);

        // Render view
        _module.render(req, res, '/categories/new.html', {
            title: "New Category",
            categories: categoryTree
        });
    }).catch(function (error) {
        req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);

        // Render view if has error
        _module.render(req, res, '/categories/new.html', {
            title: "New Category",
            categories: null
        });
    });
};

exports.saveCreate = function (req, res) {
    // Get post data
    let data = req.body;

    // Get parent category
    __models.categories.find({
        where: {
            id: data.parent
        }
    }).then(function (parentCategory) {
        // Save Author
        data.created_by = req.user.id;

        // Set level
        data.level = parentCategory.level + 1;

        // Generate alias
        if (data.alias == undefined || data.alias == '') {
            data.alias = data.name;
        }
        data.alias = slug(data.alias.toLowerCase());

        // Create category
        return __models.categories.create(data);
    }).then(function (category) {
        req.flash.success("Add new category successfully");

        // Redirect to edit page
        res.redirect('/admin/blog/categories/edit/' + category.id);
    }).catch(function (error) {
        if (error.name == 'SequelizeUniqueConstraintError') {
            req.flash.error('Category alias was duplicated');
        } else {
            req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);
        }

        // Re-render view if has error
        __models.categories.findAll({
            where: {
                published: 1
            },
            order: "name ASC"
        }).then(function (categories) {
            // Add breadcrumb and buttons
            res.locals.breadcrumb = __.create_breadcrumb(breadcrumb, {title: 'New Category'});
            res.locals.saveButton = __acl.addButton(req, route, 'category_create');
            res.locals.backButton = "/admin/blog/categories/";

            // Get categories tree
            let categoryTree = [];
            for(let i in categories){
                if(categories.hasOwnProperty(i) && categories[i].id == 1){
                    categoryTree.push(categories[i]);
                    break;
                }
            }
            categories = getCategoriesTree(1, categories);
            categoryTree = categoryTree.concat(categories);

            // Render view
            _module.render(req, res, '/categories/new.html', {
                title: "New Category",
                categories: categoryTree,
                category: data
            });
        })
    });
};

exports.edit = function (req, res) {
    // Create breadcrumb
    res.locals.breadcrumb = __.create_breadcrumb(breadcrumb, {title: 'Update Category'});

    // Add buttons
    res.locals.saveButton = __acl.addButton(req, route, 'category_edit');
    res.locals.backButton = "/admin/blog/categories/";

    promise.all(
            [
                // Find category to edit
                __models.categories.find({
                    where: {
                        id: req.params.cid
                    }
                }),

                // Find all categories except edited category
                __models.categories.findAll({
                    where: {
                        id: {
                            $not: req.params.cid
                        },
                        published: 1
                    },
                    order: "name ASC"
                })
            ]
        ).then(function (results) {
            let categories = results[1];

            // Get categories tree
            let categoryTree = [];
            for(let i in categories){
                if(categories.hasOwnProperty(i) && categories[i].id == 1){
                    categoryTree.push(categories[i]);
                    break;
                }
            }
            categories = getCategoriesTree(1, categories);
            categoryTree = categoryTree.concat(categories);

            // Render view
            _module.render(req, res, '/categories/new.html', {
                title: "Update Category",
                categories: categoryTree,
                category: results[0]
            });
        }).catch(function (error) {
            req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);

            // Render view if has error
            _module.render(req, res, '/categories/new.html', {
                title: "Update Category",
                categories: null,
                category: null
            });
        });
};

exports.saveEdit = function (req, res) {
    // Get post data
    let data = req.body;

    // Get parent category
    __models.categories.find({
        where: {
            id: data.parent
        }
    }).then(function (parentCategory) {
        // Save Editor
        data.modified_at = new Date().getTime();
        data.modified_by = req.user.id;

        // Set level
        let level = 1;
        if (req.params.cid > 1) {
            level = parentCategory.level + 1;
        }
        data.level = level;

        // Generate alias
        if (data.alias == undefined || data.alias == '') {
            data.alias = data.name;
        }
        data.alias = slug(data.alias.toLowerCase());

        // Get edited category
        return __models.categories.find({
            where: {
                id: req.params.cid
            }
        });
    }).then(function (category) {
        return category.updateAttributes(data);
    }).then(function (category) {
        req.flash.success("Update category successfully");

        // Redirect to edit page
        res.redirect('/admin/blog/categories/edit/' + category.id);
    }).catch(function (error) {
        if (error.name == 'SequelizeUniqueConstraintError') {
            req.flash.error('Category alias was duplicated');
        } else {
            req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);
        }

        // Re-render view if has error
        __models.categories.findAll({
            where: {
                id: {
                    $not: req.params.cid
                },
                published: 1
            },
            order: "name ASC"
        }).then(function (categories) {
            // Add breadcrumb and buttons
            res.locals.breadcrumb = __.create_breadcrumb(breadcrumb, {title: 'Update Category'});
            res.locals.saveButton = __acl.addButton(req, route, 'category_edit');
            res.locals.backButton = "/admin/blog/categories/";

            // Get categories tree
            let categoryTree = [];
            for(let i in categories){
                if(categories.hasOwnProperty(i) && categories[i].id == 1){
                    categoryTree.push(categories[i]);
                    break;
                }
            }
            categories = getCategoriesTree(1, categories);
            categoryTree = categoryTree.concat(categories);

            // Render view
            _module.render(req, res, '/categories/new.html', {
                title: "Update Category",
                categories: categoryTree,
                category: data
            });
        })
    });
};

exports.deleteRecord = function (req, res) {
    // Delete records by array of ids
    __models.categories.destroy({
        where: {
            id: {
                "in": req.body.ids.split(',')
            }
        }
    }).then(function () {
        req.flash.success("Delete category(s) successfully");
        res.send(204);
    }).catch(function (error) {
        if (error.name == 'SequelizeForeignKeyConstraintError') {
            req.flash.error('Cannot delete category has already in use');
            res.sendStatus(200);
        } else {
            req.flash.error('Name: ' + error.name + '<br />' + 'Message: ' + error.message);
            res.sendStatus(200);
        }
    });
};

let StringUtilities = {
    // Add prefix to string
    repeat: function (str, times) {
        str = (str == null) ? '—' : str;
        return (new Array(times + 1)).join(str);
    }
};

function getCategoriesTree(id, categories) {
    let categoriesTree = [];
    for (let index in categories) {
        // Get children of category with id
        if (categories.hasOwnProperty(index) && categories[index].parent == id) {
            let category = categories[index];
            // Add prefix '-' to category name
            category.name = StringUtilities.repeat(null, parseInt(category.level)) + " " + category.name;

            // Add category to array
            categoriesTree.push(category);

            // Remove added category
            categories.splice(index, 1);

            // Recursion to get categories tree
            categoriesTree = categoriesTree.concat(getCategoriesTree(category.id, categories));
        }
    }
    return categoriesTree;
}


