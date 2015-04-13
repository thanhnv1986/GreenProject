"use strict"
/**
 * Created by thanhnv on 2/28/15.
 */

module.exports = function (env) {
    env.addFilter('standard_sort_column', function(input){
        return input.replace(/(.*)\.(.*)/, '"$1"."$2"');
    });
}
