window.ponyplace2 = (function (ponyplace2) {
    'use strict';

    var ponyMap = {};

    ponyplace2.ponies = {
        add: function (nick, msg, avatar, x, y) {
            var newPony = {
                nick: nick,
                msg: msg,
                avatar: avatar,
                x: x,
                y: y,
                dom: ponyplace2.dom.createPony(nick, msg, avatar, x, y)
            };
            ponyMap[nick] = newPony;
        },
        avatar: function (nick, avatar) {
            ponyMap[nick].avatar = avatar;
            ponyMap[nick].dom.avatar(avatar);
        },
        msg: function (nick, msg) {
            ponyMap[nick].msg = msg;
            ponyMap[nick].dom.msg(msg);
        },
        move: function (nick, x, y) {
            ponyMap[nick].x = x;
            ponyMap[nick].x = y;
            ponyMap[nick].dom.move(x, y);
        },
        remove: function (nick) {
            ponyMap[nick].dom.destroy();
            delete ponyMap[nick];
        }
    };

    return ponyplace2;
}(window.ponyplace2));
