/**
 * Created by thanhnv on 2/28/15.
 */

module.exports = function (env) {
    env.addFilter('get_menu', function (menu_name, route, cb) {
        var start = new Date().getTime();
        __models.menus.find({
            where: {
                name: menu_name
            }
        }, {raw: true}).then(function (menu) {
            __models.menu_detail.findAll({
                where: {
                    menu_id: menu.id
                }
            }).then(function (menu_details) {
                //get menu order
                var menu_order = JSON.parse(menu.menu_order);
                var getMenuItem = function (id) {
                    for (var i in menu_details) {
                        if (menu_details[i].id == id) {
                            return menu_details[i];
                        }
                    }
                }
                var html = '';
                var buildMenu = function (arr) {
                    var tmp = '';
                    for (var i in arr) {
                        var mn = getMenuItem(arr[i].id);
                        console.log('***********',mn.link, route);
                        var active = mn.link.substring(1)===route.substring(1);
                        if (arr[i].children) {
                            tmp += '<li class="'+menu.li_cls+' '+(active?menu.li_active_cls:"")+'"><a class="'+menu.a_cls+'" data-toggle="dropdown" href="'+mn.link+'">' + mn.name+'</a><i class="fa fa-angle-down"></i>';
                            tmp += '<ul class="'+menu.sub_ul_cls+'">';
                            tmp += buildMenu(arr[i].children);
                            tmp += '</ul>';
                        }
                        else{
                            tmp += '<li class="'+(active?menu.li_active_cls:"")+'"><a href="'+mn.link+'"> ' + mn.name+'</a>';
                        }
                        tmp += '</li>';
                    }
                    return tmp;

                }
                html += '<ul class="'+menu.root_ul_cls+'">';
                html += buildMenu(menu_order);
                html += '</ul>';
                var end = new Date().getTime();
                var time = end - start;
                cb(null, html);
                console.log("*********Build Menu: ",time);
            });

        });

    }, true);
}
