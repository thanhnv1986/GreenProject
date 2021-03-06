'use strict'
/**
 * Created by thanhnv on 2/23/15.
 */
let config = require(__base + 'config/config.js');

module.exports = function (req, res, next) {
    //Check if is using admin view
    let pre_fix = '';
    let module = res.locals.route.split('/')[1];
    if (module == config.admin_prefix) {
        pre_fix = module = res.locals.route.split('/')[2];
    }
    if (module == '') {
        module = 'dashboard';
    }
    module = module.split('?')[0];
    let moduleName = module.replace('-', '_');

    if (moduleName == 'login' || moduleName == 'uploads' || moduleName == 'err') return next();
    if (__modules[moduleName] != undefined && (__modules[moduleName].system || __modules[moduleName].active)) {
        next();
    }
    else {
        req.flash.error('Module ' + module + ' is not active');
        console.log('Error *****', moduleName);
        res.redirect('/admin/err/500');
    }
};
