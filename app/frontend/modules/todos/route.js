/**
 * Created by thanhnv on 2/17/15.
 */
'use strict';

module.exports = function(app) {
    // Root routing
    var core = require('./controllers/index');
    app.route('/todos').get(core.index);

};