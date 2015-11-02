var express = require('express');
var app = express.Router();

var user = require('../models').user;  //adding the .User means we dont have to write models.User everywhere

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
  user.find({ where: { username: req.body.username }})
    .then(function(user) {
      if (user) {
        if (user.password === req.body.password) {
          if (user.banned) {
            req.flash('fail', "Umm...you've been banned.  You probably know why");
            req.session.save(function() {
              res.redirect('/login');
            });
          }
          else {
            req.session.user_id = user.id;
            req.flash('success', "Logged in!");
            req.session.save(function() {
              res.redirect('/games');
            });
          }
        } else { // user.password === req.body.password
          req.flash('warning', 'Bad password. Try ' + user.password + ' instead.');
          req.session.save(function() {
            res.redirect('/login');
          });
        }
      } else { // user
        req.flash('warning', 'Username unknown');
        req.session.save(function() {
          res.redirect('/login');
        });
      }
    });
//  user.find( {where: {
//                username: req.body.username,
//                password: req.body.password
//                }
//              }
//            )
//    .then(function(user) {
//        req.flash('success', "Logged in!");
//        req.session.user_id = user.id;
//        req.session.save(function() {
//          res.redirect('../games');
//        });
//        // req.flash('warning', "Correct login!");
//        // req.session.save(function() {
//        //   res.redirect('/login');
//        // });
//      } else {
//        res.render('login', { errors: true } );
//      }
//    });
});

module.exports = app;