/**
 * Created by thanhnv on 2/25/15.
 */
module.exports = function (menus) {
    menus.default.modules.posts = {
        title:'Posts',
        sort: 1,
        icon:'fa fa-file-o',
        menus: [
            {
                name: 'index',
                title: 'All Posts',
                link: '/'
            },
            {
                name: 'create',
                title: 'New Post',
                link: '/create'
            }

        ]
    };
    return menus;
};
