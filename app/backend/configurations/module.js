/**
 * Created by thanhnv on 2/17/15.
 */
module.exports = function (modules) {
    modules.configurations = {
        title: 'Configurations',
        rules: [
            {
                name: 'update_info',
                title: 'Update site information'
            },
            {
                name: 'change_themes',
                title: 'Change theme'
            },
            {
                name: 'import_themes',
                title: 'Import new theme'
            },
            {
                name: 'delete_themes',
                title: 'Delete theme'
            }
        ]
    }
    return modules;

};

