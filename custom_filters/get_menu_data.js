/**
 * Created by thanhnv on 2/28/15.
 */

module.exports = function (env) {
    env.addFilter('get_menu_data', function(id, _menus_data){
        for(var i in _menus_data){
            console.log(id, _menus_data[i]);
            if(id == _menus_data[i].id){
                return _menus_data[i];
            }
        }
    });
}
