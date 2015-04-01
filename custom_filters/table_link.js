"use strict"
/**
 * Created by thanhnv on 2/28/15.
 */

module.exports = function (env) {
    env.addFilter('table_link', function (link, item, acl) {
        let myRegex = /{(.*?)}/g;
        let match = myRegex.exec(link);
        while (match != null) {
            link = link.replace(/{(.*?)}/g, function (x) {
                return item[x.replace(/[{}]/g,"")];
            });
            match = myRegex.exec(link);
        }
        return link;
    });
}
