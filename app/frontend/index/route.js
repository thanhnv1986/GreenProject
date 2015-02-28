/**
 * Created by thanhnv on 2/17/15.
 */
'use strict';

module.exports = function(app) {
    // Root routing
    var core = require('./controllers/index');

    app.route('/').get(core.index);
    app.route('/change1').get(core.changetotheme1);
    app.route('/change2').get(core.changetotheme2);
};