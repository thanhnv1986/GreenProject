/**
 * Created by thanhnv on 2/28/15.
 */

module.exports = function (env) {
    env.addFilter('get_value', function(input, item){
        if(~input.indexOf('.')){
            var arr = input.split('.');
            var value = '';
            for(var i in arr){
                item = item[arr[i]];
                value = item;
            }
            return value;
        }
        else{
            return item[input];
        }
    });
}
