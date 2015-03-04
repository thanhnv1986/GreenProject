/**
 * Created by thanhnv on 2/17/15.
 */
'use strict';

module.exports = function(app) {
    // Root routing
    var core = require('./controllers/index');
    var users = require('../../backend/users/controllers/index');

    app.route('/').get(core.index);
    app.route('/index').get(core.index);
    app.route('/change1').get(core.changetotheme1);
    app.route('/change2').get(core.changetotheme2);

    app.route('/users/forgot').post(users.forgot);
    app.route('/users/reset/:userid/:token').get(users.validateResetToken, users.resetForm);
    app.route('/users/reset/:userid/:token').post(users.reset);
    app.route('/password/reset/invalid').get(users.invalidToken);
};