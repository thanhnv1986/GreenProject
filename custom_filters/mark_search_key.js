/**
 * Created by thanhnv on 2/28/15.
 */

module.exports = function (env) {
    env.addFilter('mark_search_key', function (text, keyword) {
        var regex = new RegExp('(' + keyword + ')', 'gi');
        return text.replace(regex, "<b style='color: red;'>$1</b>");
    });
}
