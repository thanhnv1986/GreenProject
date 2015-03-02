/**
 * Created by thanhnv on 2/25/15.
 */
module.exports = function (menus) {
    menus.systems.modules.configuration = {
        title:'Configuration',
        sort: 5,
        icon:"fa fa-cog",
        menus: [
            {
                name: 'update_info',
                title: 'Site Info',
                link: '/'
            },
            {
                name: 'change_theme',
                title: 'Themes',
                link: '/themes'
            }
        ]
    };
    return menus;
};
