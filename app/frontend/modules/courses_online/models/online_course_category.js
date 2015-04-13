/**
 * Created by thanhnv on 4/13/15.
 */
"use strict"
module.exports = function (sequelize, DataTypes) {
    let OnlineCourseCategory = sequelize.define("online_course_category", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: DataTypes.STRING,
        alias: DataTypes.STRING,
        created_at: DataTypes.DATE,
        created_by: DataTypes.INTEGER

    }, {
        tableName: 'online_course_category',
        createdAt: 'created_at',
        updatedAt: false,
        deletedAt: false,
        classMethods: {
            associate: function (models) {
                OnlineCourseCategory.hasMany(models.online_course_category, {
                    as: "online_course_category",
                    through: 'online_course_category_course'
                });
            }
        }
    });
    OnlineCourseCategory.sync();
    return OnlineCourseCategory;
};
