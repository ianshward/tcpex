var net = require('net');

var Transmit = function(options) {
    options.port = options.port || 5050;
    options.host = options.host || 'localhost';
    options.allowHalfOpen = options.allowHalfOpen || false;
    options.timeout = options.timeout || 3000;
    options.encoding = options.encoding || 'utf-8';

    this.config = options;
    return this;
};

Transmit.prototype.listen = function(fn) {
    var that = this;

    var server = net.createServer(this.config, function(c) {
        // This callback w/ 'c' as arg is automatically set up as a listener
        // for the 'connection' event, and 'c' is a Socket object.
        // http://nodejs.org/api/net.html#net_class_net_socket

        // Data is streamed as http://nodejs.org/api/buffer.html
        c.setEncoding(that.encoding);

        // Emit the timeout event after specified time
        c.setTimeout(that.timeout);

        var buffer = [];

        c.on('data', function(chunk) {
            if (chunk == 'quit') {
                c.end('See ya!');
            }
            //c.write('You said: ' + chunk);
            buffer.push(chunk);
        });

        // Called when the write buffer empties, as in, the server read through
        // the `chunk` buffer once. There may be more data being written to
        // the socket, and this event allows for things like throttling the
        // client from writing to the socket.
        c.on('drain', function() {
            c.pause();
            setTimeout(function() {
                c.resume();
            }, 2000);
        });

        c.on('error', function(e) {
            console.log('error emitted: %s', e.toString());
        });

        // Called when there has not been any IO on the socket after period of
        // time specified by Socket.setTimeout(). If you want this to end the
        // connection then you must manually call 'end' yourself.
        c.on('timeout', function() {
            console.log('hit timeout');
        });

        // Called when socket fully closed. This won't be called if
        // `allowHalfOpen` is set to true, and only the client ends
        // the connection.
        c.on('close', function(had_error) {
            console.log('socket fully closed');
        });

        c.on('end', function() {
            console.log('end emitted. client sent:');
            console.log(buffer.join(''));
        });

    });

    server.listen(this.config.port, this.config.host, function() {
        console.log('Server listening on %s:%s', that.config.host, that.config.port);
        fn();
    });

};

module.exports = Transmit;
