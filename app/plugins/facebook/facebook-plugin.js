/**
 * Created by thanhnv on 3/13/15.
 */
/**
 * Created by thanhnv on 3/13/15.
 */
var Promise = require('bluebird'),
    _ = require('lodash');
var _base_config = {
    alias: 'facebook',
    name: 'Facebook login',
    author: 'Jack',
    version: '0.1.0',
    description: 'Authentication with facebook',
    active: true,
    sync: false,
    options: {
        appId: '347148475491688'
    }
};

function FacebookPlugin() {
    var self = this;
    _.assign(self, _base_config);

    this.before_close_body_tag = function (data) {
        return new Promise(function (done, reject) {
            var html = '<script>' +
                'window.fbAsyncInit = function () {' +
                'FB.init({' +
                'appId: "' + self.options.appId + '",' +
                'xfbml: true,' +
                'version: "v2.2"' +
                '});' +
                '};' +

                '(function (d, s, id) {' +
                'var js, fjs = d.getElementsByTagName(s)[0];' +
                'if (d.getElementById(id)) {' +
                'return;' +
                '}' +
                'js = d.createElement(s);' +
                'js.id = id;' +
                'js.src = "//connect.facebook.net/en_US/sdk.js";' +
                'fjs.parentNode.insertBefore(js, fjs);' +
                '}(document, \'script\', \'facebook-jssdk\'));' +
                '</script>';
            done(html);
        });
    }
}
module.exports = new FacebookPlugin();

