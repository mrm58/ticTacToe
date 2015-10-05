
var express = require('express');
var app = express.Router();

var User = require('../models').User;  //adding the .User means we dont have to write models.User everywhere

app.get('/', function(req, res) {
  if (req.currentUser) {
    req.flash('info', "You've ALREADY logged in!");
    req.session.save(function() {
      res.redirect('../games');
    });
  } else {
    res.render('login');
  }
});

app.post('/', function(req, res) {
  User.find( {where: { 
                username: req.body.username,
                password: req.body.password
                } 
              }
            )
    .then(function(user) {
      if(user) {
        req.flash('success', "Logged in!");
        req.session.user_id = user.id;
        req.session.save(function() {
          res.redirect('../games');
        });
        // req.flash('warning', "Correct login!");
        // req.session.save(function() {
        //   res.redirect('/login');
        // });
      } else {
        res.render('login', { errors: true } )
      }
    });
});

module.exports = app;