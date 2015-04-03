/**
 * Created by thanhnv on 4/1/15.
 */
"use strict"
module.exports = function (app) {
    require('./core/route')(app);
    require('./index/route')(app);
    require('./blog/route')(app);
    require('./todos/route')(app);
};
