/**
 * Created by thanhnv on 2/28/15.
 */

module.exports = function (env) {
    env.addFilter('get_value', function(input, item){
        if(~input.indexOf('.')){
            var arr = input.split('.');
            return item[arr[0]][arr[1]];
        }
        else{
            return item[input];
        }
    });
}
