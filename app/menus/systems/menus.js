/**
 * Created by thanhnv on 2/25/15.
 */
module.exports = function (menus) {
    menus.systems.modules.menus = {
        title:'Menus',
        icon:"fa fa-bars",
        menus: [
            {
                rule: 'index',
                title: 'All Menus',
                link: '/'
            },
            {
                rule: 'create',
                title: 'New Menu',
                link: '/create'
            }
        ]
    };
    return menus;
};
