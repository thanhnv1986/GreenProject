/**
 * Created by thanhnv on 2/25/15.
 */
module.exports = function (menus) {
    menus.default.modules.blog = {
        title:'Blog',
        icon:'fa fa-newspaper-o',
        menus: [
            {
                rule: 'post_index',
                title: 'Posts',
                link: '/posts/'
            },
            {
                rule: 'page_index',
                title: 'Pages',
                link: '/pages/'
            },
            {
                rule: 'category_index',
                title: 'Categories',
                link: '/categories/'
            }
        ]
    };
    return menus;
};