/**
 * Created by thanhnv on 2/25/15.
 */
module.exports = function (menus) {
    menus.systems.modules.plugins = {
        title:'Plugins',
        sort: 4,
        icon:"fa fa-thumb-tack",
        menus: [
            {
                name: 'index',
                title: 'All Plugins',
                link: '/'
            }

        ]
    };
    return menus;
};
