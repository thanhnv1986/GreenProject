/**
 * Created by thanhnv on 2/25/15.
 */
module.exports = function (menus) {
    menus.systems.modules.users = {
        title:'Users',
        sort: 1,
        icon:"fa fa-user",
        menus: [
            {
                name: 'index',
                title: 'All Users',
                link: '/'
            },
            {
                name: 'create',
                title: 'New User',
                link: '/create'
            }

        ]
    };
    return menus;
};
