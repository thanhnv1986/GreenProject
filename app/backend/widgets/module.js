/**
 * Created by thanhnv on 2/17/15.
 */
module.exports = function (modules) {
    modules.widgets = {
        title: 'Wdigets',
        author: 'Nguyen Van Thanh',
        version: '0.1.0',
        description: 'Widget management of website',
        system: true,
        rules: [
            {
                name: 'index',
                title: 'All Widgets'
            }
        ]
    }
    return modules;

};

