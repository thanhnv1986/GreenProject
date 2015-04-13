/**
 * Created by thanhnv on 4/13/15.
 */
"use strict"
function OnlineCourse() {
    BaseModuleFrontend.call(this);
    this.path = "/courses_online";
}
var _module = new OnlineCourse();
exports.index = function (req, res) {
    _module.render(req,res,'courses/index');
}
exports.create_view = function (req, res) {

}
exports.create_save = function (req, res) {

}
exports.update_view = function (req, res) {

}
exports.update_save = function (req, res) {

}
exports.getByCategoryId = function(req, res, next, id){
    __models.online_course.findAndCountAll({
        //include:[__models.online_course_category],
        //where:["online_course_category = ?",id]
    },{raw:true}).then(function(result){
        req.courses = result.row;
        req.totalItem = result.count;
        next();
    });
}
exports.getByCourseId = function(req, res, next, id){
    __models.online_course.find(id,{raw:true}).then(function(course){
        req.course = course;
        res.jsonp(course);
    });
}