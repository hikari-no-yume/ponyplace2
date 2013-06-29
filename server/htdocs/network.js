window.ponyplace2 = (function (ponyplace2) {
    'use strict';

    var socket;

    ponyplace2.network = {
        connect: function (nick, callback, deathCallback) {
            var connected = false;

            socket = new WebSocket(ponyplace2.constants.WS_SERVER, ponyplace2.constants.PROTOCOL_NAME);
            socket.onopen = function () {
                callback(true);
                connected = true;
                socket.send(JSON.stringify({
                    type: 'connect',
                    nick: nick
                }));
            };
            socket.onerror = function (e) {
                if (!connected) {
                    callback(false, e);
                } else {
                    deathCallback(e);
                }
                connected = false;
            };
            socket.onclose = function (e) {
                if (!connected) {
                    callback(false, e);
                } else {
                    deathCallback(e);
                }
                connected = false;
            };
            socket.onmessage = function (e) {
                var obj;

                try {
                    obj = JSON.parse(e.data);
                } catch (e) {
                    socket.close();
                    throw new Error('Error parsing message: ' + e);
                }

                switch (obj.type) {
                    case 'add':
                        ponyplace2.ponies.add(obj.nick, obj.msg, obj.avatar, obj.x, obj.y);
                    break;
                    case 'avatar':
                        ponyplace2.ponies.avatar(obj.nick, obj.avatar);
                    break;
                    case 'msg':
                        ponyplace2.ponies.msg(obj.nick, obj.msg);
                    break;
                    case 'move':
                        ponyplace2.ponies.msg(obj.nick, obj.x, obj.y);
                    break;
                    case 'remove':
                        ponyplace2.ponies.remove(obj.nick);
                    break;
                }
            };
        }
    };

    return ponyplace2;
}(window.ponyplace2));
