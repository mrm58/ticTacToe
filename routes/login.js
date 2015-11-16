var express = require('express');
var app = express.Router();

var user = require('../models').user;  //adding the .User means we dont have to write models.User everywhere

app.get('/', function(req, res) {
  if (req.currentUser) {
    req.flash('info', "You've ALREADY logged in!");
    req.session.save(function() {
      res.redirect('/games');
    });
  } else {
    res.render('login');
  }
});

app.post('/', function(req, res) {
  if(!req.body.username || ! req.body.password) {
    req.flash('warning', 'Both a username and password are required');
    req.session.save(function() {
      res.render('login');
    });
  } else {
    user.find({ where: { username: req.body.username }})
      .then(function(user) {
        if (user) {
          if (user.password === req.body.password) {
            if (user.banned) {
              req.session.save(function() {
                res.format({
                  html: function() {
                    req.flash('fail', "Umm...you've been banned.  You probably know why");
                    res.redirect('/games');
                  },
                  json: function() {
                    res.json({ success: false, errors: 'You\'ve been banned...' });
                  }
                });
                //res.redirect('/login');
              });
            }
            else { //user.banned
              req.session.user_id = user.id;
              req.session.save(function() {
                res.format({
                  html: function() {
                    req.flash('success', 'Logged in!');
                    res.redirect('/games');
                  },
                  json: function() {
                    res.json({ success: true, message: 'Logged in!' });
                  }
                });
              });
            }
          } else { // user.password === req.body.password
            req.flash('warning', 'Bad password');
            req.session.save(function() {
              res.format({
                html: function() {
                  req.flash('warning', 'Bad password');
                  res.render('login');
                },
                json: function() {
                  res.json({ success: false, errors: 'Bad password' });
                }
              });
              //res.redirect('/login');
            });
          }
        } else { // user
          req.flash('warning', 'Username unknown');
          req.session.save(function() {
            res.format({
              html: function() {
                req.flash('warning', 'Username unknown');
                res.render('login');
              },
              json: function() {
                res.json({ success: false, errors: 'Username unknown' });
              }
            });
            //res.redirect('/login');
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
  }
});

module.exports = app;