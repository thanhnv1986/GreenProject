/**
 * Created by thanhnv on 2/25/15.
 */
module.exports = function (menus) {
    menus.systems.modules.roles = {
        title:'Roles',
        sort: 2,
        icon:"fa fa-group",
        menus: [
            {
                name: 'index',
                title: 'All Roles',
                link: '/'
            },
            {
                name: 'create',
                title: 'New Role',
                link: '/create'
            }

        ]
    };
    return menus;
};
