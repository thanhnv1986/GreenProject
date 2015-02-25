/**
 * Created by thanhnv on 2/25/15.
 */
module.exports = function (menus) {
    menus.default.modules.pages = {
        title:'Pages',
        sort: 1,
        icon:'fa fa-file-text',
        menus: [
            {
                name: 'index',
                title: 'All Pages',
                link: '/'
            },
            {
                name: 'create',
                title: 'New Page',
                link: '/create'
            }

        ]
    };
    return menus;
};
