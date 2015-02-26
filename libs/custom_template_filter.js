/**
 * Created by thanhnv on 1/29/15.
 */
var swig = require('swig');
module.exports = function () {
    swig.setFilter('vnd', function (value) {
        var c = 0,
            d = ',',
            t = '.';
        var n = value,
            c = isNaN(c = Math.abs(c)) ? 2 : c,
            d = d == undefined ? "." : d,
            t = t == undefined ? "," : t,
            s = n < 0 ? "-" : "",
            i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
            j;
        j = (j = i.length) > 3 ? j % 3 : 0;
        return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
    });

    swig.setFilter('pagination', function (totalPage, current_page, link) {
        var start = parseInt(current_page) - 4;
        if (start < 1) {
            start = 1;
        }
        var end = parseInt(current_page) + 4;
        console.log(end > totalPage, end);
        if (end > totalPage) {
            end = totalPage;
        }
        var html =
            '<div class="row">' +
                /*'<div class="col-md-5 col-sm-12">' +
                 '<div class="dataTables_info" id="sample_2_info" role="status" aria-live="polite">Showing 1 to 5 of '+totalPage+' entries</div>' +
                 '</div>' +*/
                '<div class="col-md-12">' +
                '<div class="dataTables_paginate paging_simple_numbers" id="sample_2_paginate">' +
                '<ul class="pagination pull-left">' +
                '<li class="paginate_button previous ' + (parseInt(current_page) == 1 ? "disabled" : "") + '" aria-controls="sample_2" tabindex="0" id="sample_2_previous">' +
                '<a href="' + (parseInt(current_page) == 1 ? "#" : link.replace('{page}', parseInt(current_page) - 1)) + '"><i class="fa fa-angle-left"></i></a></li>';
        if (start > 1) {
            var url = link.replace('{page}', start - 1);
            html += '<li class="paginate_button" aria-controls="sample_2" tabindex="0"><a href="' + url + '">...</a></li>'
        }
        for (var i = start; i <= end; i++) {
            var url = link.replace('{page}', i);
            var active = parseInt(current_page) == i ? "active" : "";
            html += '<li class="paginate_button ' + active + '" aria-controls="sample_2" tabindex="0"><a href="' + url + '">' + i + '</a></li>'
        }
        if (end < totalPage) {
            var url = link.replace('{page}', end + 1);
            html += '<li class="paginate_button" aria-controls="sample_2" tabindex="0"><a href="' + url + '">...</a></li>'
        }
        /*'<li class="paginate_button active" aria-controls="sample_2" tabindex="0"><a href="#">1</a></li>' +
         '<li class="paginate_button " aria-controls="sample_2" tabindex="0"><a href="#">2</a></li>' +
         '<li class="paginate_button " aria-controls="sample_2" tabindex="0"><a href="#">3</a></li>' +*/
        html += '<li class="paginate_button next" aria-controls="sample_2" tabindex="0" id="sample_2_next"><a href="' + (parseInt(current_page) == totalPage ? "#" : link.replace('{page}', parseInt(current_page) + 1)) + '"><i class="fa fa-angle-right"></i></a></li>' +
            '</ul>' +
            '</div>' +
            '</div>' +
            '</div>';
        return html;
    });
    swig.setFilter('active_menu', active_menu);
    swig.setFilter('active_page', function (value, string_to_compare, cls) {
        var arr = value.split('/');
        var st = "active";
        if (cls) {
            st = cls;
        }
        return arr[1] == string_to_compare ? st : "";
    });
    swig.setFilter('truncate', function (text, length, end) {
        text = text.replace(/(<([^>]+)>)/ig, "");
        if (isNaN(length))
            length = 10;

        if (end === undefined)
            end = "...";

        if (text.length <= length || text.length - end.length <= length) {
            return text;
        }
        else {
            return String(text).substring(0, length - end.length) + end;
        }
    });
    swig.setFilter('json_decode', function (data) {
        return JSON.parse(data);
    });
    swig.setFilter('check_state', function (rules, moduleName, action) {
        for (var i in rules) {
            if (i == moduleName) {
                if (rules[i].indexOf(action) > -1) {
                    return 'checked';
                }
            }
        }
        return '';
    });

    swig.setFilter('render_menu', function (route, menus, user) {
        var html = '';
        var sortedMenus = sortMenus(menus);
        sortedMenus.forEach(function (m) {
            //console.log(m);
            var i = m.menu;
            if (menus[i] != undefined) {
                if (user.acl[i] != undefined) {
                    var cls = active_menu(route, i.replace('_', '-'));
                    html += '<li class="' + cls + '">';
                    if (menus[i].menus.length == 1)
                        html += '<a href="/admin/' + (i.replace('_', '-') + menus[i].menus[0].link) + '">';
                    else
                        html += '<a href="javascript:;">';
                    html += '<i class="icon-arrow-right"></i>';
                    html += '<span class="title">' + menus[i].title + '</span>';
                    html += '<span class="arrow "></span>';
                    html += '</a>';

                    if (menus[i].menus.length > 1) {
                        //check submenu
                        html += '<ul class="sub-menu">';
                        for (var y in menus[i].menus) {
                            if (user.acl[i].indexOf(menus[i].menus[y].name) > -1) {
                                html += '<li>';
                                html += '<a href="/admin/' + (i.replace('_', '-') + menus[i].menus[y].link) + '">';
                                html += '<i class="icon-list"></i>';
                                html += menus[i].menus[y].title + '</a>';
                                html += '</li>';
                            }
                        }
                        html += '</ul>';
                        html += '</li>';
                    }
                }
            }
        });

        return html;
    });

    swig.setFilter('render_sidebar', function (route, user) {
        var html = '';
        sortGroups = sortMenus(__menus);
        for (var i in sortGroups) {

            var group = __menus[sortGroups[i].menu];
            html += '<li class="header">' + group.title + '</li>';
            sortModules = sortMenus(group.modules);
            for (var y in sortModules) {
                var moduleName = sortModules[y].menu;
                var subMenu = group.modules[moduleName];
                var icon = 'fa fa-circle-o text-danger';
                if (subMenu.icon) {
                    icon = subMenu.icon;
                }
                var cls = active_menu(route, moduleName.replace('-', '_'));
                html += '<li class="treeview ' + cls + '">' +
                    '<a href="{{link}}">' +
                    '<i class="' + icon + '"></i> <span>' + subMenu.title + '</span>';

                if (subMenu.menus.length > 1) {
                    html = html.replace('{{link}}', '#');
                    html += '<i class="fa fa-angle-left pull-right"></i></a>';

                    html += '<ul class="treeview-menu">';
                    for (var z in subMenu.menus) {
                        var mn = subMenu.menus[z];
                        var cls = active_menu(route, mn.link.replace('/', ''), "active", 3);
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
                    html = html.replace('{{link}}', '/admin/' + y + '');
                    html += '</a></li>';
                }

            }
        }
        return  html;
    });

    swig.setFilter('standard_route_search', function (route) {
        var st = route.split('/');
        if (st.length > 0) {
            return '/' + (st[1] == "search" ? st[2].substring(0, st[2].indexOf('?')) : st[1]);
        }
        else {
            return '';
        }
    });
    swig.setFilter('mark_search_key', function (text, keyword) {
        var regex = new RegExp('(' + keyword + ')', 'gi');
        return text.replace(regex, "<b style='color: red;'>$1</b>");
    });
    swig.setFilter('render_breadcrumb', function (breadcrumbs) {
        var html = '';
        for (var i in breadcrumbs) {
            var bread = breadcrumbs[i];
            html += '<li class="' + (i == breadcrumbs.length - 1 ? 'active' : '') + '"><a href="' + (bread.href != undefined ? bread.href : '#') + '">' + (bread.icon != undefined ? '<i class="' + bread.icon + '"></i>' : '') + (bread.title) + '</a></li>';
        }
        return html;
    });
    swig.setFilter('get_menu',function(menu_name){
        var html = '<h1>Menu here</h1>';

        var data = __models.menus.find({
            where: {
                name: "Main Menu"
            }
        }).then(function (menu) {
            html = "abac";
            return html;
        });

    });
};

function active_menu(value, string_to_compare, cls, index) {
    var arr = value.split('/');
    var st = "active";
    if (cls) {
        st = cls;
    }
    if (index) {
        return arr[index] === string_to_compare ? st : "";
    }
    return arr[2] == string_to_compare ? st : "";
}

function compare(a, b) {
    if (a.sort < b.sort)
        return -1;
    if (a.sort > b.sort)
        return 1;
    return 0;
}

function sortMenus(menus) {
    var sortable = [];
    for (var m in menus) {
        //console.log(menus[m].sort);
        sortable.push({menu: m, sort: menus[m].sort})
    }
    sortable.sort(compare);
    return sortable;
}
