/**
 * Created by thanhnv on 2/17/15.
 */
module.exports = function (modules) {
    modules.menus = {
        title: 'Menus',
        rules: [
            {
                name: 'index',
                title: 'All Menus'
            },
            {
                name: 'create',
                title: 'Create New'
            },
            {
                name: 'update',
                title: 'Update'
            },
            {
                name: 'delete',
                title: 'Delete'
            }
        ]
    }
    return modules;

};

