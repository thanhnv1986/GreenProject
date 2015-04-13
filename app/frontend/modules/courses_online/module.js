/**
 * Created by thanhnv on 4/13/15.
 */
module.exports = function (modules) {
    modules.course_online = {
        title: 'Course Online',
        author: 'FreeSky Team',
        version: '0.1.0',
        description: 'Course Online',
        rules: [
            {
                name: 'course_category_index',
                title: 'View All Course Categories'
            },
            {
                name: 'course_category_create',
                title: 'Create Course Category'
            },
            {
                name: 'course_category_update',
                title: 'Update Course Category'
            },
            {
                name: 'course_category_delete',
                title: 'Delete Course Category'
            },
            {
                name: 'course_category_delete_all',
                title: 'Delete Other Course Category'
            },
            {
                name: 'lecture_index',
                title: 'View Lecture'
            },
            {
                name: 'lecture_create',
                title: 'Create Lecture'
            },
            {
                name: 'lecture_delete',
                title: 'Delete Lecture'
            },
            {
                name: 'lecture_delete_all',
                title: 'Delete Other Lecture'
            }

        ]
    };
    return modules;
};


