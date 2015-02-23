/**
 * Created by thanhnv on 2/4/15.
 */
module.exports = function (menus) {
    menus.posts = {
        title: 'Posts',
        sort: 2,
        menus: [
            {
                name: 'index',
                title: 'All Posts',
                link: ''
            },
            {
                name: 'create',
                title: 'Add New',
                link: '/create'
            }
        ]
    }
    return menus;

};

