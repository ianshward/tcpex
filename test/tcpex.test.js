var net = require('net')
  , chai = require('chai')
  , expect = chai.expect
  , Tcpex = require('..')
  , server;

describe('tcpex', function() {

    before(function(done) {
        server = new Tcpex({
            host: 'localhost',
            port: 5050,
            timeout: 500
        });
        server.listen(function(err, greeting) {
            expect(greeting).to.equal('Server listening on localhost:5050');
            done();
        });
    });

    it('should let constructor override defaults', function() {
        expect(server.config.timeout).to.deep.equal(500);
    });


});
