'use strict'
/**
 * Created by vhchung on 1/26/15.
 */
let express = require('express'),
    router = express.Router(),
    categories = require('./controllers/categories'),
    posts = require('./controllers/posts'),
    pages = require('./controllers/pages');

let moduleName = 'blog';

router.route('/blog').get(__acl.isAllow(moduleName, 'post_index'), posts.index);

router.route('/blog/categories').get(__acl.isAllow(moduleName, 'category_index'), categories.index);
router.route('/blog/categories/create').get(__acl.isAllow(moduleName, 'category_create'), categories.create);
router.route('/blog/categories/create').post(__acl.isAllow(moduleName, 'category_create'), categories.saveCreate);
router.route('/blog/categories/edit/:cid').get(__acl.isAllow(moduleName, 'category_edit'), categories.edit);
router.route('/blog/categories/edit/:cid').post(__acl.isAllow(moduleName, 'category_edit'), categories.saveEdit);
router.route('/blog/categories/delete/').post(__acl.isAllow(moduleName, 'category_delete'), categories.deleteRecord);
router.route('/blog/categories/page/:page').get(__acl.isAllow(moduleName, 'category_index'), categories.index);
router.route('/blog/categories/page/:page/sort/:sort/(:order)?').get(__acl.isAllow(moduleName, 'category_index'), categories.index);

router.route('/blog/posts').get(__acl.isAllow(moduleName, 'post_index'), posts.index);
router.route('/blog/posts/create').get(__acl.isAllow(moduleName, 'post_create'), posts.create);
router.route('/blog/posts/create').post(__acl.isAllow(moduleName, 'post_create'), posts.saveCreate);
router.route('/blog/posts/edit/:cid').get(__acl.isAllow(moduleName, 'post_edit'), posts.edit);
router.route('/blog/posts/edit/:cid').post(__acl.isAllow(moduleName, 'post_edit'), posts.saveEdit);
router.route('/blog/posts/delete').post(__acl.isAllow(moduleName, 'post_delete'), posts.deleteRecord);
router.route('/blog/posts/page/:page').get(__acl.isAllow(moduleName, 'post_index'), posts.index);
router.route('/blog/posts/page/:page/sort/:sort/(:order)?').get(__acl.isAllow(moduleName, 'post_index'), posts.index);

router.route('/blog/pages').get(__acl.isAllow(moduleName, 'page_index'), pages.index);
router.route('/blog/pages/create').get(__acl.isAllow(moduleName, 'page_create'), pages.create);
router.route('/blog/pages/create').post(__acl.isAllow(moduleName, 'page_create'), pages.saveCreate);
router.route('/blog/pages/edit/:cid').get(__acl.isAllow(moduleName, 'page_edit'), pages.edit);
router.route('/blog/pages/edit/:cid').post(__acl.isAllow(moduleName, 'page_edit'), pages.saveEdit);
router.route('/blog/pages/delete').post(__acl.isAllow(moduleName, 'page_delete'), pages.deleteRecord);
router.route('/blog/pages/page/:page').get(__acl.isAllow(moduleName, 'page_index'), pages.index);
router.route('/blog/pages/page/:page/sort/:sort/(:order)?').get(__acl.isAllow(moduleName, 'page_index'), pages.index);

module.exports = router;