/**
 * Created by thanhnv on 2/28/15.
 */

module.exports = function (env) {
    env.addFilter('flash_message', function (messages) {
        var html = '';
        for (var i in messages) {
            var mgs_class='';
            var mgs_icon='';
            var message = messages[i];
            if(message.type == 'error'){
                mgs_class = 'alert-danger';
                mgs_icon = 'icon fa fa-ban';
            }
            if(message.type == 'success'){
                mgs_class = 'alert-success';
                mgs_icon = 'icon fa fa-check';
            }
            if(message.type == 'warning'){
                mgs_class = 'alert-warning';
                mgs_icon = 'icon fa fa-warning';
            }
            if(message.type == 'info'){
                mgs_class = 'alert-notice';
                mgs_icon = 'icon fa fa-info';
            }
            html+='<div class="alert '+mgs_class+' alert-dismissable">'+
                '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>'+
                '<h4><i class="'+mgs_icon+'"></i>'+message.content+'</h4></div>';
        }
        return html;
    });
}
