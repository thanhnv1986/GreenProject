/**
 * Created by thanhnv on 2/17/15.
 */
module.exports = function (modules) {
    modules.pages = {
        title: 'Pages',
        author: 'Nguyen Van Thanh',
        version: '0.1.0',
        description: 'Pages management of website',
        rules: [
            {
                name: 'index',
                title: 'All Pages'
            }

        ]
    }
    return modules;

};

