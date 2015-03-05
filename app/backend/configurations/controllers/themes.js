/**
 * Created by thanhnv on 3/4/15.
 */
var config = require(__base + 'config/config');
var fs = require('fs');
var breadcrumb =
    [
        {
            title: 'Home',
            icon: 'fa fa-dashboard',
            href: '/admin'
        },
        {
            title: 'Configurations',
            href: '/admin/configurations'
        },
        {
            title: 'Themes',
            href: '/admin/configurations/themes'
        }
    ];
exports.index = function (req, res) {
    //breadcrumb
    res.locals.breadcrumb = __.create_breadcrumb(breadcrumb);
    var themes = [];
    config.getGlobbedFiles(__base + 'app/themes/**/theme.json').forEach(function (filePath) {
        console.log(filePath);
        themes.push(require(filePath));
    });
    for(var i in themes){
        if(themes[i].name.toLowerCase()==config.themes.toLowerCase()){
            var current_theme = __current_theme = themes[i];
        }
    }
    res.render('configurations/themes/index',{
        themes:themes,
        current_theme: current_theme
    });
};
exports.change_themes = function (req, res) {
    config.themes = req.params.themeName;
    res.send("OK");

};
exports.delete = function (req, res) {
    res.send("ok")

};
exports.import = function (req, res) {
    res.send("ok")

};
