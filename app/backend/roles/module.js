/**
 * Created by thanhnv on 2/17/15.
 */
module.exports = function (modules) {
    modules.roles = {
        title: 'Roles',
        rules: [
            {
                name: 'index',
                title: 'All Roles'
            },
            {
                name: 'create',
                title: 'Add New'
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

