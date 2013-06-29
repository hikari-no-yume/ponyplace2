window.ponyplace2 = (function (ponyplace2) {
    'use strict';

    var container;

    ponyplace2.dom = {
        init: function () {
            container = document.getElementById('container');
            ponyplace2.dom.initLogin();
        },
        initLogin: function () {
            container.innerHTML = document.getElementById('login-template').innerHTML;
            document.getElementById('login-btn').onclick = function () {
                ponyplace2.dom.initConnecting();
            };
        },
        initConnecting: function () {
            ponyplace2.network.connect(document.getElementById('nickname').value, function (success, error) {
                if (success) {
                    ponyplace2.dom.initConnected();
                } else {
                    ponyplace2.dom.initConnectionFailure(error);
                }
            }, ponyplace2.dom.initConnectionLoss);
            container.innerHTML = document.getElementById('connecting-template').innerHTML;
        },
        initConnectionFailure: function (error) {
            container.innerHTML = document.getElementById('connectfail-template').innerHTML;
            document.getElementById('error').appendChild(document.createTextNode(error));
        },
        initConnectionLoss: function (error) {
            container.innerHTML = document.getElementById('connectloss-template').innerHTML;
            document.getElementById('error').appendChild(document.createTextNode(error));
        },
        initConnected: function () {
            container.innerHTML = document.getElementById('connected-template').innerHTML;
        },
        createPony: function (nick, msg, avatar, x, y) {
            var pony, ponyDom, msgDom, avatarDom, nickDom;

            pony = {
                avatar: function (avatar) {
                    avatarDom.src = ponyplace2.constants.MEDIA_PATH + '/' + avatar + '.gif';
                    avatarDom.alt = nick + "'s avatar: " + avatar;
                },
                msg: function (msg) {
                    msgDom.innerHTML = '';
                    msgDom.appendChild(document.createTextNode(msg));
                },
                move: function (x, y) {
                    ponyDom.style.left = x + 'px';
                    ponyDom.style.top = y + 'px';
                },
                destroy: function () {
                    container.removeChild(ponyDom);
                }
            };

            ponyDom = document.createElement('div');
            ponyDom.className = 'pony';
            ponyDom.style.left = x + 'px';
            ponyDom.style.top = y + 'px';

            msgDom = document.createElement('div');
            msgDom.className = 'pony-msg';
            ponyDom.appendChild(msgDom);

            avatarDom = document.createElement('img');
            avatarDom.className = 'pony-avatar';
            ponyDom.appendChild(avatarDom);

            nickDom = document.createElement('div');
            nickDom.className = 'pony-nick';
            nickDom.appendChild(document.createTextNode(nick));
            ponyDom.appendChild(nickDom);

            pony.avatar(avatar);
            pony.msg(msg);
            pony.move(x, y);

            container.appendChild(ponyDom);

            return pony;
        }
    };

    return ponyplace2;
}(window.ponyplace2));
