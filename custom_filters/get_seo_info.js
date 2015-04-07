/**
 * Created by vhchung on 3/16/15.
 */
var config = require(__base + 'config/config');
module.exports = function (env) {
    env.addFilter('get_seo_info', function (seo_info) {
        if (!seo_info) {
            seo_info = {
                meta_title: config.app.title || 'ArrowJs',
                meta_keyword: config.app.keywords || 'arrowjs',
                meta_description: config.app.description || 'An opensource framework written in Javascript'
            }
        }
        if(this.ctx.title) seo_info.meta_title = this.ctx.title;
        if(this.ctx.keyword) seo_info.meta_keyword = this.ctx.keyword;
        var func = env.getFilter('safe');
        var html = '<title>' + seo_info.meta_title + '</title>\n' +
            '<meta name="keywords" content="' + seo_info.meta_keyword + '">\n';

        if(this.ctx.description) {
            var func1 = env.getFilter('striptags');
            var func2 = env.getFilter('truncate');
            var des = func2(func1(this.ctx.description), 155);
            html += '<meta name="description" content="' + des + '">';
        } else html += '<meta name="description" content="' + seo_info.meta_description + '">';

        return func(html);
    });
};