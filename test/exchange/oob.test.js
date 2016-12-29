var chai = require('chai')
  , oob = require('../../lib/exchange/oob');


describe('exchange.oob', function() {
  
  it('should be named oob', function() {
    expect(oob(function(){}, function(){}).name).to.equal('oob');
  });
  
  it('should throw if constructed without an authenticate callback', function() {
    expect(function() {
      oob();
    }).to.throw(TypeError, 'oauth2orize-2fa.oob exchange requires an authenticate callback');
  });
  
  it('should throw if constructed without an issue callback', function() {
    expect(function() {
      oob(function(){});
    }).to.throw(TypeError, 'oauth2orize-2fa.oob exchange requires an issue callback');
  });
  
  describe('authenticating and issuing an access token', function() {
    var response, err;

    before(function(done) {
      function authenticate(token, done) {
        if (token !== 'ey...') { return done(new Error('incorrect token argument')); }
        
        return done(null, { id: '1', username: 'johndoe' })
      }
      
      function issue(client, user, oobCode, done) {
        if (client.id !== 'c123') { return done(new Error('incorrect client argument')); }
        if (user.username !== 'johndoe') { return done(new Error('incorrect user argument')); }
        if (oobCode !== 'a1b2c3') { return done(new Error('incorrect oobCode argument')); }
        
        return done(null, 's3cr1t')
      }
      
      chai.connect.use(oob(authenticate, issue))
        .req(function(req) {
          req.user = { id: 'c123', name: 'Example' };
          req.body = { access_token: 'ey...', oob_code: 'a1b2c3' };
        })
        .end(function(res) {
          response = res;
          done();
        })
        .dispatch();
    });
    
    it('should respond with headers', function() {
      expect(response.getHeader('Content-Type')).to.equal('application/json');
      expect(response.getHeader('Cache-Control')).to.equal('no-store');
      expect(response.getHeader('Pragma')).to.equal('no-cache');
    });
    
    it('should respond with body', function() {
      expect(response.body).to.equal('{"access_token":"s3cr1t","token_type":"Bearer"}');
    });
  });
  
});