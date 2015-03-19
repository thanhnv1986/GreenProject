/**
 * Created by thanhnv on 2/28/15.
 */

module.exports = function (env) {
    env.addFilter('flash_message', function (messages) {
        var html = '';
        console.log(messages);
        if (messages && messages.length > 0) {
            html += '<div class="margin no-print">';

            for (var i in messages) {
                var mgs_class = '';
                var mgs_icon = '';
                var message = messages[i];
                if (message.type == 'error') {
                    mgs_class = 'callout-danger';
                    mgs_icon = 'icon fa fa-ban';
                }
                if (message.type == 'success') {
                    mgs_class = 'callout-success';
                    mgs_icon = 'icon fa fa-check';
                }
                if (message.type == 'warning') {
                    mgs_class = 'callout-warning';
                    mgs_icon = 'icon fa fa-warning';
                }
                if (message.type == 'info') {
                    mgs_class = 'callout-notice';
                    mgs_icon = 'icon fa fa-info';
                }
                html += '<div class="callout ' + mgs_class + '" style="margin-bottom:0px;">' +
                    '<h4><i class="' + mgs_icon + '"></i> ' + message.type.toUpperCase() + '</h4>' +
                    '<p>' + message.content +
                    '</div>';
            }
            html += '</div>';
        }

        return html;
    });
}
