/**
 * Created by thanhnv on 2/25/15.
 */
module.exports = function (menus) {
    menus.systems.modules.configurations = {
        title:'Configurations',
        sort: 5,
        icon:"fa fa-cog",
        menus: [
            {
                name: 'update_info',
                title: 'Site Info',
                link: '/site-info'
            },
            {
                name: 'change_themes',
                title: 'Themes',
                link: '/themes'
            }
        ]
    };
    return menus;
};
