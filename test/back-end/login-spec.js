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

  it('should be a unknown user - json route', function(done) {
    var user = require('../../models').user;
    request(app)
      .post('/login')
      .send({username: 'abc123', password: 'password'})
      .set('Accept', 'application/json')
      .expect({success: false, errors: 'Username unknown'}, done);
  });

  it('should be a unknown user - normal route', function(done) {
    var user = require('../../models').user;
    request(app)
      .post('/login')
      .send({username: 'abc123', password: 'password'})
      .expect(200)
      .end(function(err,res) {
        res.text.should.include('Username unknown');
        done();
      });
      //.expect({success: false, errors: 'Username unknown'}, done);
  });

  it('should be a bad password - json route', function(done) {
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

  it('should be a bad password - normal route', function(done) {
    var user = require('../../models').user;
    user.create({ username: 'abc123', password: 'mypassword', email: 'user@example.com' })
      .then(function(u) {
        request(app)
          .post('/login')
          .send({username: 'abc123', password: 'password'})
          .expect(200)
          .end(function(err, res) {
            res.text.should.include('Bad password');
            done();
          });
      });
  });

  it('should be a banned user', function(done) {
    var user = require('../../models').user;
    user.create({ username: 'abc123', password: 'mypassword', email: 'user@example.com', banned: true })
      .then(function(u) {
        console.log(u);
        request(app)
          .post('/login')
          .send({username: 'abc123', password: 'mypassword'})
          .set('Accept', 'application/json')
          .expect({success: false, errors: 'You\'ve been banned...'}, done);
      });
  });

  it('should be a good login - json route', function(done) {
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

  it('should be a good login - normal route', function(done) {
    var user = require('../../models').user;
    user.create({ username: 'abc123', password: 'mypassword', email: 'user@example.com' })
      .then(function(u) {
        request(app)
          .post('/login')
          .send({username: 'abc123', password: 'mypassword'})
          .expect(302, done());
          // .end(function(err, res) {
          //   res.text.should.include('Logged in');
          //   done();
          // });
      });
  });

  describe('when a user exists', function() {
    beforeEach(function(done) {
      require('../../models').user
        .create({ username: 'abc123', password: 'NotTelling' })
        .then(_.ary(done, 0));
    });

    it('should allow a user to login with the correct password', function(done) {
      request(app)
        .post('/login')
        .send({username: 'abc123', password: 'NotTelling'})
        .expect(302, done());
    });

    it('should not allow a user to login without the correct password', function(done) {
      request(app)
        .post('/login')
        .send({username: 'abc123', password: 'wrongPassword'})
        .expect(200)
        .end(function(err, res) {
          res.text.should.include('Bad password');
          done();
        });
    });

    it('should not allow a user to login providing a username', function(done) {
      request(app)
        .post('/login')
        .send({password: 'wrongPassword'})
        .expect(200)
        .end(function(err, res) {
          res.text.should.include('Both a username and password are required');
          done();
        });
    });

    it('should not allow a user to login providing a password', function(done) {
      request(app)
        .post('/login')
        .send({username: 'abc123'})
        .expect(200)
        .end(function(err, res) {
          res.text.should.include('Both a username and password are required');
          done();
        });
    });

    it('should not allow a user to login providing a username or password', function(done) {
      request(app)
        .post('/login')
        .expect(200)
        .end(function(err, res) {
          res.text.should.include('Both a username and password are required');
          done();
        });
    });

  });

});