/**
 * Created by thanhnv on 2/23/15.
 */
"use strict";

var fs        = require("fs");
var path      = require("path");
var Sequelize = require("sequelize");

var env       = process.env.NODE_ENV || "development";
var config    = require('../config/config.js');
var sequelize = new Sequelize(config.db.database, config.db.username, config.db.password, config.db);
var db        = {};

config.getGlobbedFiles('./app/backend/**/models/*.js').forEach(function (routePath) {
    console.log(routePath);
    var model = sequelize["import"](path.resolve(routePath));
    db[model.name] = model;

});

Object.keys(db).forEach(function(modelName) {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

