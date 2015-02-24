/**
 * Created by thanhnv on 2/20/15.
 */
var config = require(__base+'config/config.js');
module.exports = function(req, res, next){
    // grab reference of render
    var _render = res.render;
    // override logic
    res.render = function( view, options, fn ) {
        view = config.themes+'/'+view;
        // continue with original render
        _render.call( this, view, options, fn );
    }
    next();
}
