/**
 * Created by thanhnv on 2/17/15.
 */

exports.index=function(req, res){
    res.locals.breadcrump = [
        {
            title:'Home',
            icon:'fa fa-dashboard',
            href:'/admin'
        },
        {
            title:'Dashboard'
        }
    ];
    res.render('dashboard/index');
};