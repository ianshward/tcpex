var Transmit = require('./lib/transmit');

var server = new Transmit({
  port: 5050,
  host: 'localhost',
});

server.listen(function() {

});
