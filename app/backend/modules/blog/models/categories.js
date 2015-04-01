"use strict"
module.exports = function (sequelize, DataTypes) {
    let Categories = sequelize.define("categories", {
        parent: DataTypes.INTEGER,
        level: DataTypes.INTEGER,
        name: DataTypes.STRING(255),
        alias: DataTypes.STRING(255),
        description: DataTypes.STRING,
        published: DataTypes.BOOLEAN,
        created_at: DataTypes.DATE,
        created_by: DataTypes.INTEGER,
        modified_at: DataTypes.DATE,
        modified_by: DataTypes.INTEGER
    }, {
        tableName: 'arr_categories',
        createdAt: 'created_at',
        updatedAt: 'modified_at',
        classMethods: {
            associate: function (models) {
                Categories.belongsTo(models.user, {foreignKey: 'created_by'});
            }
        }
    });
    return Categories;
};