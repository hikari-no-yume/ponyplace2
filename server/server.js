var fs = require('fs'),
    http = require('http');

var express = require('express'),
    websocket = require('websocket');

var constants = require('./constants');

var app = express();

[
    ['/', 'index.html', 'text/html'],
    ['/style.css', 'style.css', 'text/css'],
    ['/core.js', 'core.js', 'text/javascript'],
    ['/constants.js', 'constants.js', 'text/javascript'],
    ['/network.js', 'network.js', 'text/javascript'],
    ['/ponies.js', 'ponies.js', 'text/javascript'],
    ['/dom.js', 'dom.js', 'text/javascript'],
    ['/init.js', 'init.js', 'text/javascript'],
].forEach(function (item) {
    app.get(item[0], function (req, res) {
        var body = fs.readFileSync('htdocs/' + item[1]);
        res.setHeader('Content-Type', item[2]);
        res.setHeader('Content-Length', body.length);
        res.send(body);
    });
});
app.get('*', function (req, res) {
    res.send(404);
});

var server = http.createServer(app);
server.listen(8000, function () {
    console.log((new Date()) + ' Server is listening on port 8080');
});

wsServer = new websocket.server({
    httpServer: server
});

wsServer.on('request', function(request) {
    if (request.origin !== constants.ORIGIN) {
        // Make sure we only accept requests from an allowed origin
        request.reject();
        console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected. (Wrong origin: ' + request.origin + ')');
        return;
    }

    if (request.requestedProtocols.length !== 1 || request.requestedProtocols[0] !== 'ponyplace2') {
        // Make sure we only accept requests with correct protocol
        request.reject();
        console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected. (Wrong protocol: ' + request.protocols + ')');
        return;
    }

    var connection = request.accept('ponyplace2', request.origin);
    console.log((new Date()) + ' Connection accepted.');

    connection.once('message', function(msg) {
        var obj;

        if (msg.type !== 'utf8') {
            console.log('Received non-UTF8 Message');
            connection.close();
            return;
        }

        try {
            obj = JSON.parse(msg.utf8Data);
        } catch (e) {
            console.log('Error parsing message: ' + e);
            connection.close();
            return;
        }

        connection.sendUTF(JSON.stringify({
            type: 'add',
            avatar: 'derpy_left',
            x: 0,
            y: 0,
            nick: obj.nick,
            msg: 'hi'
        }));
        
        connection.on('message', function(message) {
            if (message.type === 'utf8') {
                console.log('Received Message: ' + message.utf8Data);
                connection.sendUTF(message.utf8Data);
            }
            else if (message.type === 'binary') {
                console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
                connection.sendBytes(message.binaryData);
            }
        });
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});
