/**
 * Created by thanhnv on 3/24/15.
 */

module.exports = function (socket_manager, socket) {
    if (socket_manager.todos == undefined) {
        socket_manager.todos = [];
    }
    socket_manager.io.on('connection', function (socket) {
        socket_manager.publish('todos:list', socket_manager.todos);
    });
    socket.on('todos:add', function (todo) {
        socket_manager.todos.push(todo);
        socket_manager.publish('todos:list', socket_manager.todos);
    });

}
