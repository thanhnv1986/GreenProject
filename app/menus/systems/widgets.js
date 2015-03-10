/**
 * Created by thanhnv on 2/25/15.
 */
module.exports = function (menus) {
    menus.systems.modules.widgets = {
        title: 'Widgets',
        sort: 4,
        icon: 'fa fa-file-text',
        menus: [
            {
                name: 'index',
                title: 'All Widgets',
                link: '/'
            },
            {
                name: 'index',
                title: 'Sidebars',
                link: '/sidebars'
            }

        ]
    };
    return menus;
};
