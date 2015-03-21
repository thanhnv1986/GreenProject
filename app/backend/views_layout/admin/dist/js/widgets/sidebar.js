/**
 * Created by thanhnv on 3/9/15.
 */

$(function () {
    $("#widgets li").draggable({
        appendTo: "body",
        helper: "clone"
    });
    $(".sidebar-widget").droppable({
        activeClass: "ui-state-default",
        hoverClass: "widget-state-hover",
        accept: ":not(.ui-sortable-helper)",
        drop: function (event, ui) {
            $(this).find(".placeholder").remove();
            var li = $("<li style='position: relative' id=''></li>");
            li.append("<div class='widget-item'></div>");
            li.append('<a href="#" class="fa fa-caret-down expand_arrow" onclick="return showDetail(this);"></a>');
            _this = $(this);
            li.find(".widget-item").first().text(ui.draggable.text());
//                    var ul = $(this).find('.widget-list').first();
            var ul = $(this);
            $.ajax({
                url: '/admin/widgets/sidebars/add/' + ui.draggable.attr('data-alias')
            }).done(function (re) {
                var new_box = $("<div class='box box-solid open'><div class='box-body'></div></div>");
                new_box.find(".box-body").first().append(re);
                new_box.find("form").first().append("<input type='hidden' name='sidebar' value='" + _this.parents('.box').first().attr('id') + "'>");
                new_box.find("form").first().append("<input type='hidden' name='ordering' value='" + (ul.find("li").length + 1) + "'>");
                li.append(new_box);
                ul.append(li);
            });
//                    $(this).find('.box-body').append("<div class='box box-solid close'><div class='box-body'></div></div>");

        }
    }).sortable({
        delay: 100,
        items: "li",
        placeholder: "placeholder",
        sort: function () {
            // gets added unintentionally by droppable interacting with sortable
            // using connectWithSortable fixes this, but doesn't allow you to customize active/hoverClass options
            $(this).removeClass("ui-state-default");
        },
        connectWith: ".sidebar-widget",
        receive: function (event, ui) {
            $(this).find(".placeholder").remove();
            console.log("Receive");
            console.log(this);
            var ids = $(this).sortable('toArray');
            console.log(ids);
            sorting(this, ids);
        },
        remove: function (event, ui) {
            if ($(this).find('.widget-item').length == 0 && $(this).find('.placeholder').length == 0) {
                $(this).find("ul").append("<li class='placeholder'>Drop widget here</li>");
            }
        },
        stop: function (event, ui) {
            console.log("Stop");
            console.log(this);
            var ids = $(this).sortable('toArray');
            console.log(ids);
            sorting(this, ids);
        }
        /*start: function (event, ui) {
         if ($(this).find('.widget-item').length == 1 && $(this).find('.placeholder').length == 0) {
         $(this).find("ul").append("<li class='placeholder'>Drop widget here</li>");
         }
         }*/
    });

    /*$('.sidebar-widget .widget-list textarea').each(function(index){
     console.log(this.id);
     CKEDITOR.replace(this.id);
     });*/

});
function showDetail(element, changeIcon) {
    var box = $(element).parents("li").first().find('.box').first();
    if (box.hasClass('open')) {
        box.removeClass('open');
        box.addClass('close');
        if (changeIcon == undefined) {
            $(element).removeClass('fa-caret-down');
            $(element).addClass('fa-caret-left');
        }
        else {
            var el = $(element).parents('li').first().find('a').first();
            $(el).removeClass('fa-caret-down');
            $(el).addClass('fa-caret-left');
        }

    }
    else {
        box.removeClass('close');
        box.addClass('open');
        if (changeIcon == undefined) {
            $(element).removeClass('fa-caret-left');
            $(element).addClass('fa-caret-down');
        }


    }
    return false;
}

function saveWidget(button) {
    var form = $(button).parents('form');
    var box = $(button).parents('.box').first();
    var widget = $(button).parents("li").first();
    showBlock(box);
    $.ajax({
        type: "POST",
        url: '/admin/widgets/sidebars/save',
        data: form.serialize() // serializes the form's elements.
    }).done(function (id) {
        form.find('input[name="id"]').val(id);
        form.find('input[name="ordering"]').remove();
        removeBlock(box);
        return false;
    });
    return false;
}

function removeWidget(button) {
    var id = $(button).parents('form').find('input[name="id"]').val();
    var box = $(button).parents('.box').first();
    if (id != '') {
        //delete in database
        showBlock(box);
        $.ajax({
            url: '/admin/widgets/sidebars/' + id,
            type: "DELETE"
        }).done(function (re) {
            $(button).parents('li').first().remove();
            removeBlock(box);
            return false;
        });
    } else {
        $(button).parents('li').first().remove();
    }
    return false;
}

function showBlock(element) {
    $(element).append('<div class="overlay"><i class="fa fa-refresh fa-spin"></i></div>');
}
function removeBlock(element) {
    $(element).find(".overlay").remove();
}
function sorting(element, ids) {
    var box = $(element).parents(".box").first();
    for (var i in ids) {
        if (ids[i] == '') {
            box.find("form").find("input[name='ordering']").val(parseInt(i) + 1);
        }
    }
    showBlock(box);
    $.ajax({
        url: '/admin/widgets/sidebars/sort',
        type: 'POST',
        data: {
            ids: ids.join(','),
            sidebar: box.attr('id')
        }
    }).done(function (re) {
        removeBlock(box);
    });
}


