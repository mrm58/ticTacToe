var express = require('express');
var app = express.Router();

var board = require('../models').board;  //adding the .Board means we dont have to write models.Board everywhere
var user = require('../models').user;

app.param('game_id', function(req, res, next) {
  board.findById(req.params.game_id).then(function(b) {
    if (b) {
      req.board = res.locals.board = b;
      next();
    } else {
      res.status(404).send('Game not found');
    }
  });
});

var accepts = {
  'json': 'application/json',
  'html': 'text/html'
};

app.param('format', function checkFormat(req, res, next, param) {
  console.log('checking format param: ' + param);
  req.headers.accept = accepts[param];
  next();
});

app.get('/', function(req, res) {
    console.log('in games route base getter');
    board.findAll().then(function(boards) {
      res.format({
          html: function() {
            console.log('in html return format');
            res.render('games', { boards: boards });
          },
          json: function() {
            console.log('in json return format');
            res.json(boards);
          }
      });
      // if (req.session.user_id) {
      //   user.findById(req.session.user_id).then(function(user) {
      //     res.render('games', { boards: boards, user: user });
      //   });
      // } else {
      //   res.render('games', { boards: boards });
      // }
    });
});

app.get('/available', function(req, res) {
  board.scope('available').findAll().then(function(boards) {
    res.render('games', { title: "Available Games",
                          boards: boards });
  });
});

// create a fresh new game
app.post('/', function(req, res) {
    board.create({ board: '         ' }) //{ board: req.body.board })
        .then(function(board) {
            res.redirect('/games/' + board.id);
        })
        .catch(function(errors) {
            board.findAll().then(function(boards) {
                res.render('games', { boards: boards, errors: errors });
            });
            //req.alert('Initial board state must consiste of exactly 9 characters of which only [XO ] are allowed');
            //res.send(JSON.stringify(errors));
        });
});

app.get('/:game_id.:format?', function(req, res) {
  res.format({
      html: function() {
        res.render('individualGame');
      },
      json: function() {
        res.json(req.board);
      }
  });
});

app.get('/:game_id/players', function(req, res) {
  res.render('gamePlayers');
});

app.post('/:game_id', function(req, res) {
  req.board.set('board', req.body.board);
  req.board.save().then(function(board) {
    res.format({
      html: function() {
        res.redirect('/games/' + board.id);
      },
      json: function() {
        res.json(board);
      }
    });
  })
  .catch(function(error) {
    res.format({
      html: function() {
        res.flash('error', error.message);
        req.session.save(function() {
          res.redirect('/games/' + req.board.id);
        });
      },
      json: function() {
        res.json(error);
      }
    });
  });
});


app.post('/:game_id/join', function(req, res) {
  if (!req.currentUser) {
    res.flash('warning', 'You need to be logged in to join a game');
    res.redirect('/games/' + req.board.id);
  } else {
    console.log('Adding user ' + req.currentUser.username + ' to game #' + req.board.id);
    if (req.body.asX) {
      req.board.setXPlayer(req.currentUser).then(function() {
        // render something
      });
    } else {
      req.board.setOPlayer(req.currentUser).then(function() {
        // render something
      });
    }
  }
});

module.exports = app;