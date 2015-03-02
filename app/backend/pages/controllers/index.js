/**
 * Created by thanhnv on 2/17/15.
 */
var route = 'modules';
var breadcrumb =
    [
        {
            title: 'Home',
            icon: 'fa fa-dashboard',
            href: '/admin'
        },
        {
            title: 'Pages',
            href: '/admin/pages'
        }
    ];
exports.index = function (req, res) {
    //breadcrumb
    res.locals.breadcrumb = __.create_breadcrumb(breadcrumb);
    res.render('pages/index', {
        title: "All Pages"
    });


};

