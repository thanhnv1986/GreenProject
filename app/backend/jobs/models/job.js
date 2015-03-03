/**
 * Created by thanhnv on 1/19/15.
 */
module.exports = function (sequelize, DataTypes) {
    var slug = require('slug');
    var Job = sequelize.define("job", {
        content: DataTypes.STRING,
        title: DataTypes.STRING,
        name: DataTypes.STRING,
        expires_date: DataTypes.DATE,
        job_company_info: DataTypes.STRING,
        job_link: DataTypes.STRING,
        logo_company_url: DataTypes.STRING,
        requirement: DataTypes.STRING,
        source: DataTypes.STRING,
        crawl_date: DataTypes.STRING,
        job_skill_id: DataTypes.STRING,
        job_loc_id: DataTypes.STRING
    }, {
        freezeTableName: true,
        timestamps: false,
        // I don't want createdAt
        createdAt: false,

        // I want updatedAt to actually be called updateTimestamp
        updatedAt: false,
        // And deletedAt to be called destroyTime (remember to enable paranoid for this to work)
        deletedAt: false,
        hooks: {
            beforeUpdate: function(job, next) {
                job.name = slug(job.title).toLowerCase();
            }
        }
    });
    return Job;
};
