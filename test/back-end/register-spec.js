require('./utils');
var request = require('supertest');
var should = require('chai').should();
var app = require('../../index').app;
var _ = require('lodash');

describe('register page', function() {
  it('should display the register page', function(done) {
    request(app)
      .get('/register')
      .set('Accept', 'application/html')
      .expect('Content-Type', /html/)
      .expect(200, done);
  });

  it('should be an error because the user already exists', function(done) {
    var user = require('../../models').user;
    user.create({ username: 'abc123', password: 'mypassword', email: 'user@example.com' })
      .then(function(u) {
        request(app)
          .post('/register')
          .send({username: 'abc123', password: 'password', email: 'user@example.com'})
          .set('Accept', 'application/json')
          .expect({success: false, errors: 'Username already exists'}, done);
      });
  });

  it('should accept the new user', function(done) {
    var user = require('../../models').user;
    request(app)
      .post('/register')
      .send({username: 'abc123', password: 'password', email: 'user@example.com'})
      .set('Accept', 'application/json')
      .end(function(err, res) {
        res.body.success.should.equal(true);
        user.find({ where: { username: 'abc123' }})
          .then(function(user) {
            should.exist(user);
            user.username.should.equal('abc123');
          });
        done();
      });
  });

});