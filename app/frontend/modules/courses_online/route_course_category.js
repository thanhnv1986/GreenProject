/**
 * Created by thanhnv on 4/13/15.
 */
"use strict"
module.exports = function(app) {
    // Root routing
    let controller = require('./controllers/online_course_category');
    app.route('/online-course-category')
        .get()
        .delete();

};