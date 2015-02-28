/**
 * Created by thanhnv on 2/23/15.
 */
var config = require(__base + 'config/config.js');
var modules = require(__base + 'lib/modules_manager');
module.exports = function (req, res, next) {
    //Check if is using admin view
    var module = res.locals.route.split('/')[1];
    if(module==config.admin_prefix){
        module = res.locals.route.split('/')[2];
    }
    if(modules[module.replace('-','_')].active){
        next();
    }
    else{
        res.send("Module is not active");
    }
}
