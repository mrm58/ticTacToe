
var express = require('express');
var app = express.Router();

var user = require('../models').user;


//User Registration section
app.get('/', function(req, res) {
  // models.user.findAll( { attributes: ['username'] } )
  //   .then(function(userList) {
  //     res.render('register', { userList: userList.map });
  //   });
  res.render('register');
});

app.post('/', function(req, res) {
  // Does the user exist already?
  if(!req.body.password) {
    req.flash('warning', 'Password required');
    req.session.save(function() {
      res.render('register');
    });
  } else {
    user.find( { where: { username: req.body.username } } )
      .then(function(u) {
        if(u) {
          req.session.save( function() {
            res.format({
              html: function() {
                req.flash('warning', 'Username already exists');
                res.render('register');
              },
              json: function() {
                res.json({success: false, errors: 'Username already exists'});
              }
            });
          });
        } else {
          user.create(req.body)
            .then(function(newUser) {
              req.session.user_id = newUser.id;
              req.session.save(function() {
                res.format({
                  html: function() {
                    res.redirect('/games');
                  },
                  json: function() {
                    res.json({success: true});
                  }
                });
                // res.redirect('/games');
              });
            });
        }
        //res.send(JSON.stringify(user));
      });
  }
});

module.exports = app;