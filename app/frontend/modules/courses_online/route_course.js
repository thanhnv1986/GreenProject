/**
 * Created by thanhnv on 4/13/15.
 */
"use strict"
module.exports = function(app) {
    // Root routing
    let controller = require('./controllers/online_course');
    app.route('/my-account/online-course/:categoryId')
        .get(controller.index);

    app.route('/my-account/online-course/create')
        .get(controller.create_view)
        .post(controller.create_save);

    app.route('/my-account/online-course/detail/:courseId')
        .get(controller.update_view)
        .post(controller.update_save);

    app.params('categoryId',controller.getByCategoryId);
    app.params('courseId',controller.getByCourseId);
};