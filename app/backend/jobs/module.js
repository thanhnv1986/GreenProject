/**
 * Created by thanhnv on 2/17/15.
 */
module.exports = function (modules) {
    modules.jobs = {
        title: 'Jobs',
        author: 'Vu Hoang Chung',
        version: '0.1.0',
        description:'Job management of website',
        system:true,
        rules: [
            {
                name: 'index',
                title: 'All Jobs'
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

