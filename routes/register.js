
var express = require('express');
var app = express.Router();

var User = require('../models').User;


//User Registration section
app.get('/', function(req, res) {
  // models.User.findAll( { attributes: ['username'] } )
  //   .then(function(userList) {
  //     res.render('register', { userList: userList.map });
  //   });
  res.render('register');
});

app.post('/', function(req, res) {
  //res.send(JSON.stringify(req.body));
  models.User.find( { where: { username: req.body.username } } )
    .then(function(user) {
      if(user) {
        req.flash('warning', "Username already exists");
        req.session.save(function() {
          res.redirect('/register');
        });
      } else {
        models.User.create(req.body)  //Assumes the parameter names match the DB column names
          .then(function(newUser) {
            req.session.user_id = newUser.id;
            req.session.save(function() {
              res.redirect('../games');
            });
          });
        // req.flash('warning', "Username does NOT already exist! YAY!");
        // req.session.save(function() {
        //   res.redirect('/register');
        // });
      }
      //res.send(JSON.stringify(user));
    });
});

module.exports = app;