var should = chai.should;

beforeEach(function() {
  this.clog = Clog({source: 'test-app'});
  this.serverUrl = 'http://localhost:5000';
  this.server = sinon.fakeServer.create();
})

afterEach(function() {
  this.server.restore();
})

describe('#log()', function() {
  beforeEach(function() {
    this.server.respondWith('POST', this.serverUrl + '/api/v1/logs/', [
      201, {'Content-Type': 'application/json'},
      '{"id": 1, "source": "test-app", "log": "test"}'
    ]);
  })

  it('should submit log events to server', function() {
    var cb = sinon.spy();
    this.clog.log('frame 1\nframe 2', cb);
    this.server.respond();
    sinon.assert.calledWith(cb, {'id': 1, 'source': 'test-app', 'log': 'test'});
  })
});
