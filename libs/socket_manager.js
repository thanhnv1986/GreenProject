/**
 * Created by thanhnv on 3/21/15.
 */

var socket = require('socket.io');
function SocketManager(server) {
    var self = this;
    self.clients = [];
    self.io = socket.listen(server);
    self.io.on('connection', function (socket) {
        console.log('has connection connected');
        self.clients[socket.id] = socket;
        socket.on('disconnect', function () {
            delete self.clients[socket.id];
            console.log('connection disconnected');
        });
    });

}

SocketManager.prototype.publish = function (key, data, options) {
    this.io.emit(key, data);
};

module.exports = SocketManager;


