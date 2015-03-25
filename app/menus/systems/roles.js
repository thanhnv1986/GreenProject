/**
 * Created by thanhnv on 2/25/15.
 */
module.exports = function (menus) {
    menus.systems.modules.roles = {
        title:'Roles',
        icon:"fa fa-group",
        menus: [
            {
                rule: 'index',
                title: 'All Roles',
                link: '/'
            },
            {
                rule: 'create',
                title: 'New Role',
                link: '/create'
            }

        ]
    };
    return menus;
};
