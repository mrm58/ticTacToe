
var express = require('express');
var app = express.Router();

var models = require('./models');

app.use(function(req, res, next) {
  req.isAuthenticated = function() {
    return !!req.currentUser;
  };
  if (req.session.user_id) {
    models.user.findById(req.session.user_id).then(function(user) {
      if (user) {
        console.log("User logged in as " + user.username);
        req.currentUser = res.locals.currentUser = user;
      }
      next();
    });
  } else {
    next();
  }
});

var roles = require('./roles');
app.use(roles.middleware({ userProperty: 'currentUser' }));

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/game', function(req, res) {
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

app.use('/users', require('./routes/users'));
app.use('/login', require('./routes/login'));
app.use('/admin', require('./routes/admin'));
app.use('/register', require('./routes/register'));

//Logout section
app.get('/logout', function(req, res) {
  if (req.currentUser) {
    req.session.destroy(function(err) {
      // cannot access session here
    });
    res.render('logout');
  } else {
    res.render('logout', {errors: 'You are not logged in'});
  }
});

app.get('/partials/:name', function(req, res) {
  res.render('partials/' + req.params.name);
});


app.get('/*', function(req, res) {
  res.render('index');
});

module.exports = app;