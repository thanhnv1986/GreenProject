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
                rule: 'index',
                title: 'All Widgets',
                link: '/'
            },
            {
                rule: 'index',
                title: 'Sidebars',
                link: '/sidebars'
            }

        ]
    };
    return menus;
};
