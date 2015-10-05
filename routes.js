
var express = require('express');
var app = express.Router();

var models = require('./models');

app.use(function(req, res, next) {
  if (req.session.user_id) {
    models.User.findById(req.session.user_id).then(function(user) {
      req.currentUser = res.locals.currentUser = user;
      next();
    });
  } else {
    next();
  }
});

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/game', function(req,res) {
  //console.log(req.query);
  var playerName = req.session.playerName;
  res.render('game', { username: playerName });
});

app.post('/game', function(req, res) {
  req.session.playerName = req.body.username;
  req.session.save(function() {
    res.redirect('/game');
  });
});

app.use('/games', require('./routes/games'));

app.use('/login', require('./routes/login'));

//Logout section
app.get('/logout', function(req, res) {
  if (req.currentUser) {
    req.session.destroy(function(err) {
      // cannot access session here
    });
    res.render('logout');
  } else {
    res.render('games');
  }
});

//Users section
app.get('/users/', function(req, res) {
  models.User.findAll().then(function(users) {
    res.render('users', { users: users });
  });
});

//User Registration section
app.get('/register', function(req, res) {
  res.render('register');
});

app.post('/register', function(req, res) {
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
              res.redirect('/games');
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