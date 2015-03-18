/**
 * Created by thanhnv on 2/23/15.
 */
var menus = {};
module.exports = function () {
    //Main Navigation group
    menus.default = {
        title: 'Main Navigation',
        sort: 1,
        modules: {}
    };
    //System group
    menus.systems = {
        title: 'Systems',
        sort: 2,
        modules: {}
    };
    menus.sorting = {};
    menus.sorting.default = [
        "pages",
        "post"
    ];
    menus.sorting.systems = [
        "users",
        "roles",
        "menus",
        "widgets",
        "modules",
        "plugins",
        "configurations"
    ];

    return menus;
};

