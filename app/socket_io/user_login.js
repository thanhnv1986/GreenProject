/**
 * Created by thanhnv on 3/24/15.
 */

module.exports = function (socket_manager, socket) {
    if (socket_manager.clients == undefined) {
        socket_manager.clients = [];
    }
    socket.on('disconnect', function () {
//        console.log('||||||||||||||||| a connection disconnected', socket.user_index);
        if (socket.user_index)
            socket_manager.clients.splice(socket.user_index, 1);
        socket_manager.publish('user:user-list', socket_manager.clients);
    });
    socket.on('user:connected', function (user) {
        var isNew = true;
        for (var i in socket_manager.clients) {
            if (socket_manager.clients[i].id == user.id) {
                isNew = false;
                socket_manager.clients[i] = user;
//                console.log('---------- override: ', user);
                break;
            }
        }
        if (isNew) {
//            console.log('$$$$$$$ push: ', user);
            socket_manager.clients.push(user);
            socket.user_index = socket_manager.clients.length - 1;
        }
//        console.log('###########', socket_manager.clients);
        socket_manager.publish('user:user-list', socket_manager.clients);
    });
}
