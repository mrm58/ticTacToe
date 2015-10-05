
var express = require('express');
var app = express.Router();

var Board = require('../models').Board;  //adding the .Board means we dont have to write models.Board everywhere
var User = require('../models').User;

// app.param('game_id', function(req, res, next) {
//   board.findById(req.params.game_id).then(function(b) {
//     req.board = res.locals.board = b;
//     next();
//   });
// });

app.get('/', function(req, res) {
    Board.findAll().then(function(boards) {
        if (req.session.user_id) {
          User.findById(req.session.user_id).then(function(user) {
            res.render('games', { boards: boards, user: user });
          })
        } else {
          res.render('games', { boards: boards });
        }
    });
});

app.post('/', function(req, res) {
    Board.create({ board: req.body.board })
        .then(function(board) {
            res.redirect('/games/' + board.id);
        })
        .catch(function(errors) {
            Board.findAll().then(function(boards) {
                res.render('games', { boards: boards, errors: errors });
            });
            //req.alert('Initial board state must consiste of exactly 9 characters of which only [XO ] are allowed');
            //res.send(JSON.stringify(errors));
        });
});

app.get('/:game_id', function(req, res) {
    Board.findById(req.params.game_id).then(function(board) {
        res.render('individualGame', { board: board });
    });
});

// app.post('/:game_id', function(req, res) {
//     Board.findById(req.params.game_id).then(function(board) {
//         board.updateAttributes({
//             board: req.params.board
//         });
//     });
//     // Board.update({id: req.body.board.id, board: req.body.board })
//     //     .then(function(board) {
//     //         res.redirect('/games/');
//     //     })
// });

module.exports = app;