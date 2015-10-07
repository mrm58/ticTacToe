
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

app.use('/users', require('./routes/users'));

app.use('/register', require('./routes/register'));

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

module.exports = app;