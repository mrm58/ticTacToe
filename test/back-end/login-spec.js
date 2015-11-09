require('./utils');
var request = require('supertest');
var should = require('chai').should();
var app = require('../../index').app;
var _ = require('lodash');

describe('login page', function() {
  it('should display the login page', function(done) {
    request(app)
      .get('/login')
      .set('Accept', 'application/html')
      .expect('Content-Type', /html/)
      .expect(200, done);
  });

  it('should be a unknown user', function(done) {
    var user = require('../../models').user;
    request(app)
      .post('/login')
      .send({username: 'abc123', password: 'password'})
      .set('Accept', 'application/json')
      .expect({success: false, errors: 'Username unknown'}, done);
  });

  it('should be a bad password', function(done) {
    var user = require('../../models').user;
    user.create({ username: 'abc123', password: 'mypassword', email: 'user@example.com' })
      .then(function(u) {
        request(app)
          .post('/login')
          .send({username: 'abc123', password: 'password'})
          .set('Accept', 'application/json')
          .expect({success: false, errors: 'Bad password'}, done);
      });
  });

  // it('should be a banned user', function(done) {
  //   var user = require('../../models').user;
  //   user.create({ username: 'abc123', password: 'mypassword', email: 'user@example.com', banned: true })
  //     .then(function(u) {
  //       console.log(u);
  //       request(app)
  //         .post('/login')
  //         .send({username: 'abc123', password: 'mypassword'})
  //         .set('Accept', 'application/json')
  //         .expect({success: false, errors: 'You\'ve been banned...'}, done);
  //     });
  // });

  it('should be a good login', function(done) {
    var user = require('../../models').user;
    user.create({ username: 'abc123', password: 'mypassword', email: 'user@example.com' })
      .then(function(u) {
        request(app)
          .post('/login')
          .send({username: 'abc123', password: 'mypassword'})
          .set('Accept', 'application/json')
          .expect({success: true, message: 'Logged in!'}, done);
      });
  });

});