/**
 * Created by thanhnv on 2/23/15.
 */
exports.isAllow = function (route, action, orAction, hasAuthorize) {
    return function (req, res, next) {
        if (req.user != undefined && req.user.acl[route] != undefined) {
            var rules = req.user.acl[route].split(':');
            for (var i in rules) {
                if (action == rules[i]) {
                    next();
                    return;
                }
                if (orAction != null && orAction == rules[i]) {
                    if (hasAuthorize(req, res, next)) {
                        next();
                        return;
                    }

                }

            }

        }
//        console.log(route, action, orAction);
//        console.log(req.user);
        req.flash.error("You do not have permission to access");
        res.render('/404');
    }

}
exports.addButton = function (req, route, action) {
    if (req.user != undefined && req.user.acl[route] != undefined) {
        var rules = req.user.acl[route].split(':');
        for (var i in rules) {
            if (action == rules[i]) {
                return route.replace('_', '-');
            }

        }
    }
}



