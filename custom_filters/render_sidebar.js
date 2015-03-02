/**
 * Created by thanhnv on 2/28/15.
 */

module.exports = function (env) {
    env.addFilter('render_sidebar', function (route, user) {
        var html = '';
        sortGroups = __.sortMenus(__menus);
        for (var i in sortGroups) {

            var group = __menus[sortGroups[i].menu];
            html += '<li class="header">' + group.title + '</li>';
            sortModules = __.sortMenus(group.modules);
            for (var y in sortModules) {
                var moduleName = sortModules[y].menu;
                var subMenu = group.modules[moduleName];
                var icon = 'fa fa-circle-o text-danger';
                if (subMenu.icon) {
                    icon = subMenu.icon;
                }
                var cls = __.active_menu(route, moduleName.replace('-', '_'));
                html += '<li class="treeview ' + cls + '">' +
                    '<a href="{{link}}">' +
                    '<i class="' + icon + '"></i> <span>' + subMenu.title + '</span>';

                if (subMenu.menus.length > 1) {
                    html = html.replace('{{link}}', '#');
                    html += '<i class="fa fa-angle-left pull-right"></i></a>';

                    html += '<ul class="treeview-menu">';
                    for (var z in subMenu.menus) {
                        var mn = subMenu.menus[z];
                        var cls = __.active_menu(route, mn.link.replace('/', ''), "active", 3);
                        html += '<li class="treeview ' + cls + '">' +
                            '<a href="/admin/' + (moduleName + mn.link) + '">' +
                            '<i class="fa fa-circle-o"></i> <span>' + mn.title + '</span>' +
                            '</a>' +
                            '</li>';
                    }
                    html += '</ul>';
                    html += '</li>';
                }
                else {
                    html = html.replace('{{link}}', '/admin/' + sortModules[y].menu + '');
                    html += '</a></li>';
                }

            }
        }
        return  html;
    });
}
