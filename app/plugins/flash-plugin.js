/**
 * Created by thanhnv on 3/2/15.
 */
module.exports = function(req, res, next){
    req.flash = {
        success:function(content){
            __messages.push({
                type:'success',
                content:content
            })
        },
        error:function(content){
            __messages.push({
                type:'error',
                content:content
            })
        },
        warning:function(content){
            __messages.push({
                type:'warning',
                content:content
            })
        },
        info:function(content){
            __messages.push({
                type:'info',
                content:content
            })
        }
    }
    next();
}
