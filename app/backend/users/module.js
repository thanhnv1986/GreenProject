/**
 * Created by thanhnv on 2/17/15.
 */
module.exports = function (modules) {
    modules.admin_users = {
        title: 'Users',
        rules: [
            {
                name: 'index',
                title: 'All Users'
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

