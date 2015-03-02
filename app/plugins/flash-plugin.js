/**
 * Created by thanhnv on 3/2/15.
 */
module.exports = function(req, res, next){
    res.locals.messages = [];
    req.flash = {
        success:function(content){
            res.locals.messages.push({
                type:'success',
                content:content
            })
        },
        error:function(content){
            res.locals.messages.push({
                type:'error',
                content:content
            })
        },
        warning:function(content){
            res.locals.messages.push({
                type:'warning',
                content:content
            })
        },
        info:function(content){
            res.locals.messages.push({
                type:'info',
                content:content
            })
        }
    }
    next();
}
