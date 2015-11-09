require('./utils');
var request = require('supertest');
var should = require('chai').should();
var app = require('../../index').app;
var _ = require('lodash');

describe('users list', function() {
  it('should list users', function(done) {
    request(app)
      .get('/users')
      .set('Accept', 'application/json')
      .expect(200, done);
  });

  it('should return no users when there are not any', function(done) {
    request(app)
      .get('/users')
      .set('Accept', 'application/json')
      .expect(200, { users: [] }, done);
  });

  it('should return a single user when there is only one', function(done) {
    var user = require('../../models').user;
    user.create({ username: 'abc123', password: 'mypassword', email: 'user@example.com' })
      .then(function(u) {
        request(app)
          .get('/users')
          .set('Accept', 'application/json')
          .expect({ users: [ { id: u.id, username: 'abc123', email: 'user@example.com' } ] }, done);
      });
  });

  it('should return two users when there are two', function(done) {
    var user = require('../../models').user;
    user.bulkCreate([
      { username: 'user1', password: 'mypassword', email: 'user1@example.com' },
      { username: 'user2', password: 'notelling', email: 'user2@gmail.net' }
    ]).then(function(userList) {
        request(app)
          .get('/users')
          .set('Accept', 'application/json')
          .expect({ users: [ { id: 1, username: 'user1', email: 'user1@example.com' },
                             { id: 2, username: userList[1].username, email: 'user2@gmail.net' }
                            ] }, done);
      });
  });

  it('should return five users when there are six', function(done) {
    var user = require('../../models').user;
    user.bulkCreate(_.map(_.times(6), function(i) {
      return { username: 'user' + i, password: 'password' + i, email: 'user' + i + '@gmail.web' };
    })).then(function(userList) {
        userList.should.have.length(6);
        request(app)
          .get('/users')
          .set('Accept', 'application/json')
          .end(function(err, res) {
            res.body.users.should.have.length(5);
            done();
          });
      });
  });

  it('should return the next five users after the initial five', function(done) {
    var user = require('../../models').user;
    user.bulkCreate(_.map(_.times(10), function(i) {
      return { username: 'user' + i, password: 'password' + i, email: 'user' + i + '@gmail.web' };
    })).then(function(userList) {
        userList.should.have.length(10);
        request(app)
          .get('/users?page=2')
          //.query( {page: 2} ) does the same thing
          .set('Accept', 'application/json')
          .end(function(err, res) {
            res.body.users.should.have.length(5);
            res.body.previousPage.should.equal(1);
            should.not.exist(res.body.nextPage);
            res.body.users[0].username.should.equal(userList[5].username);
            done();
          });
      });
  });

  it('should return the last 3 users after the initial 10', function(done) {
    var user = require('../../models').user;
    user.bulkCreate(_.map(_.times(13), function(i) {
      return { username: 'user' + i, password: 'password' + i, email: 'user' + i + '@gmail.web' };
    })).then(function(userList) {
        userList.should.have.length(13);
        request(app)
          .get('/users')
          .query( {page: 3} )
          .set('Accept', 'application/json')
          .end(function(err, res) {
            res.body.users.should.have.length(3);
            res.body.previousPage.should.equal(2);
            should.not.exist(res.body.nextPage);
            res.body.users[0].username.should.equal(userList[10].username);
            done();
          });
      });
  });

  it('should return 3 names that contains msq', function(done) {
    var user = require('../../models').user;
    user.bulkCreate([
      { username: 'msquared', password: 'mypassword', email: 'msquared@example.com' },
      { username: 'the_msquared', password: 'mypassword', email: 'themsquared@example.com' },
      { username: 'msquaredtoo', password: 'mypassword', email: 'msquaredtoo@example.com' }
      ]).then(function(userList) {
        userList.should.have.length(3);
        request(app)
          .get('/users')
          .query( {userSearch: 'msq'} )
          .set('Accept', 'application/json')
          .end(function(err, res) {
            res.body.users.should.have.length(3);
            should.not.exist(res.body.previousPage);
            should.not.exist(res.body.nextPage);
            done();
          });
      });
  });

});