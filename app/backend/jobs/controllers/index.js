/**
 * Created by thanhnv on 3/3/15.
 */
'use strict';

/**
 * Module dependencies.
 */
var async = require('async'),
    chalk = require('chalk'),
    slug = require('slug'),
    _ = require('lodash'),
    path = require('path'),
    company_logo_url = "/img/jobs/",
    folder_to_upload = __base + 'public/img/jobs/';
var formidable = require('formidable'),
    http = require('http'),
    util = require('util'),
    fs = require('fs');

var route = 'jobs';

/**
 * job middleware
 */
exports.jobByID = function (req, res) {
    res.locals.saveButton = acl.addButton(req, route, 'update');
    res.locals.deleteButton = acl.addButton(req, route, 'delete');
    res.locals.backButton = route + '/page/1';
    var id = req.param('jobId');
    async.parallel([
        function (callback) {
            __models.job.find(id).then(function (job) {
                callback(null, job);
            });
        },
        function (callback) {
            __models.job_skill.findAll({
                order: 'name asc'
            }).then(function (jobSkills) {
                callback(null, jobSkills);
            });
        }
    ],
        function (err, results) {
            res.locals.viewButton = route + '/' + id + '/' + results[0].name;
            res.render('admin/jobs/edit-admin', {
                job: results[0],
                jobSkills: results[1],
                primaryHeader:  'Cập nhật việc làm'
            });
        });
};

exports.create = function (req, res) {
    res.locals.saveButton = acl.addButton(req, route, 'create');
    res.locals.backButton = route + '/page/1';
    async.parallel([
        function (callback) {
            __models.job_skill.findAll({
                order: 'name asc'
            }).then(function (jobSkills) {
                callback(null, jobSkills);
            });
        },
        function (callback) {
            __models.job_location.findAll({
                order: 'title asc'
            }).then(function (jobSkills) {
                callback(null, jobSkills);
            });
        }
    ],
        function (err, results) {
            res.render('admin/jobs/new-admin', {
                jobSkills: results[0],
                jobLocations: results[1],
                primaryHeader:  'Thêm mới việc làm'
            });
        });

};

exports.save = function (req, res, next) {
    req.messages = [];
    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields, files) {
        //console.log(files.logo_company_url);
        //console.log(fields);
        var type = files.logo_company_url.name.split('.');
        type = type[type.length - 1];
        fs.rename(files.logo_company_url.path, folder_to_upload + slug(fields.title).toLowerCase() + '.' + type, function (err) {
            if (err) {
                req.messages.push({type: 'error', content: "Lỗi khi thêm việc làm mới: không upload được logo."});
                next();
            }
            else
                async.parallel([
                    function (callback) {
                        company_logo_url += slug(fields.title).toLowerCase();
                        console.log(chalk.yellow(company_logo_url));
                        var des = fields.desc;
                        var job_company_info = {
                            full_name: fields.company_name,
                            shortdes: des.substr(0, 160) + '...',
                            description: des,
                            address: fields.address
                        };

                        var data = {
                            title: fields.title,
                            name: slug(fields.title).toLowerCase(),
                            content: fields.content,
                            logo_company_url: company_logo_url,
                            expires_date: revertDate(fields.expires_date),
                            job_loc_id: fields.job_loc_id,
                            job_skill_id: fields.job_skill_id,
                            job_company_info: JSON.stringify(job_company_info)
                        };
                        console.log(data);
                        callback(null, data);
                    }
                ], function (err, result) {
                    var data = result[0];
                    if (data)
                        __models.job.create(data).then(function () {
                            req.messages.push({type: 'success', content: "Thêm việc làm mới thành công"});
                            next();
                        });
                });

        });

    });
};

/**
 * Update a job
 */
exports.update = function (req, res) {
    var data = req.body;
    __models.job.find({
        where: {
            id: req.params.jobId
        }
    }).then(function (job) {
        job.updateAttributes(data).then(function () {
            res.send('Success');
        });
    });
};

/**
 * Delete an job
 */
exports.delete = function (req, res) {
    __models.job.destroy({
        where: {
            id: {
                'in': req.param('ids').split(',')
            }
        }
    }).then(function () {
        res.send(200);
    });
};

/**
 * List of jobs
 */
exports.list = function (req, res) {
    //Them button
    res.locals.createButton = acl.addButton(req, route, 'create');
    res.locals.deleteButton = acl.addButton(req, route, 'delete');
    var totalItem,
        totalPage,
        currentPage = req.param('page') || 1,
        numberItemInPage = 15;
    async.parallel([
        function (callback) {
            __models.job_skill.findAll({
                order: 'name asc'
            }).then(function (jobSkills) {
                callback(null, jobSkills);
            });
        },
        function (callback) {
            __models.job.findAndCountAll({
                limit: numberItemInPage,
                offset: (currentPage - 1) * numberItemInPage,
                order: 'id desc'
            }).then(function (jobs) {
                for (var i = 0; i < jobs.rows.length; i++) {
                    var d = jobs.rows[i].expires_date;
                    var curr_date = d.getDate();
                    var curr_month = d.getMonth() + 1; //Months are zero based
                    var curr_year = d.getFullYear();
                    jobs.rows[i].expires_dates = curr_date + "/" + curr_month + "/" + curr_year
                }

                totalItem = jobs.count;
                totalPage = Math.ceil(totalItem / numberItemInPage);
                callback(null, jobs);
            });
        }
    ], function (err, results) {
        res.render('admin/jobs/index-admin', {
            jobs: results[1].rows,
            currentPage: currentPage,
            totalPage: totalPage,
            jobSkills: results[0],
            primaryHeader: 'Danh sách việc làm'
        });
    });
};

/**
 * job authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
    if (req.job.user.id !== req.user.id) {
        return res.status(403).send('User is not authorized');
    }
    next();
};

function revertDate(date) {
    var arr = date.split('-');
    arr.reverse();
    return arr.join('-')
}

