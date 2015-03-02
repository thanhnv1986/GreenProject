/**
 * Created by thanhnv on 2/23/15.
 */
var config = require(__base + 'config/config.js');
module.exports = function (req, res, next) {
    //Check if is using admin view
    var pre_fix = '';
    var module = res.locals.route.split('/')[1];
    if (module == config.admin_prefix) {
        pre_fix = module = res.locals.route.split('/')[2];
    }
    if (module == '') {
        module = 'dashboard';
    }
    var moduleName = module.replace('-', '_');
    if (moduleName == 'login') return next();
    if (__modules[moduleName] != undefined && (__modules[moduleName].system || __modules[moduleName].active)) {
        next();
    }
    else {
        req.flash.error('Module ' + module + ' is not active');
        if (pre_fix != '') {
            res.render('admin/500');
        }
        else {
            res.render('500');
        }

    }
}
