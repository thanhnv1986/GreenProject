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

}
exports.getByCategoryId = function(req, res, id, next){
    __models.online_course.findAllAndCount({
        include:[__models.online_course_category],
        where:["online_course_category = ?",id]
    },{raw:true}).then(function(result){
        req.courses = result.row;
        req.totalItem = result.count;
        next();
    });
}
exports.getByCourseId = function(req, res, id, next){
    __models.online_course.find(id,{raw:true}).then(function(course){
        req.course = course;
        res.jsonp(course);
    });
}