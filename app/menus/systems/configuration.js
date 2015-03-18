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
                rule: 'update_info',
                title: 'Site Info',
                link: '/site-info'
            },
            {
                rule: 'change_themes',
                title: 'Themes',
                link: '/themes'
            }
        ]
    };
    return menus;
};
