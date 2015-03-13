/**
 * Created by thanhnv on 2/28/15.
 */

module.exports = function (env) {
    env.addFilter('get_data_source', function (source, cb) {
        if (typeof source == 'string') {
            __models.sequelize.query("select * from " + source).then(function (data) {
                cb(null, data[0]);
            });
        }
        else {
            cb(null, source);
        }

    }, true);
}
