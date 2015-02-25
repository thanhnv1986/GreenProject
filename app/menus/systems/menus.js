/**
 * Created by thanhnv on 2/25/15.
 */
module.exports = function (menus) {
    menus.systems.modules.menus = {
        title:'Menus',
        sort: 3,
        icon:"fa fa-bars",
        menus: [
            {
                name: 'index',
                title: 'All Menus',
                link: '/'
            },
            {
                name: 'create',
                title: 'New Menu',
                link: '/create'
            }

        ]
    };
    return menus;
};
