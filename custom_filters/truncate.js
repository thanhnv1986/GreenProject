/**
 * Created by thanhnv on 2/28/15.
 */

module.exports = function (env) {
    env.addFilter('truncate', function (text, length, end) {
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
}
