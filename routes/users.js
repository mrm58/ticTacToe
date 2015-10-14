
var express = require('express');
var router = express.Router();

var User = require('../models').User;

var accepts = {
  'json': 'application/json',
  'html': 'text/html'
};

router.param('format', function checkFormat(req, res, next, param) {
  req.headers.accept = accepts[param];
  next();
});

router.param('username', function(req, res, next) {
  User.findOne({ where: { username: req.params.username } })
    .then(function(user) {
      if(user) {
        req.user = res.locals.user = user;
        next();
      } else {
        res.status(404).send('Username ' + req.params.username + ' not found');
      }
    });
});

//Query for checking if a username exists in the User db or not
router.get('/usernameExists', function(req, res) {
  User.findOne({ where: { username: req.query.username } })
    .then(function(user) {
      if (user) {
        res.json(true);
      } else {
        res.json(false);
      }
    });
});

//Users section
router.get('/', function(req, res) {
  User.findAll().then(function(userList) {
    res.render('users', { users: userList });
  });
});
// router.get('/', function(req, res) {
//   User.findAll( { attributes: ['username'] } ).then(function(users) {
//     res.render('users', { users: users });
//   });
// });

//Individual user section

//router.get('/:username.:format?', function(req, res) {
router.get('/:username', function(req, res) {
  //User.findOne({ where: { username: req.params.username } })
  //  .then(function(user) {
      res.format({
        html: function() {
          res.render('individualUser');
        },
        json: function() {
          res.json(req.user);
        }
      });
  //});

    // Board.findById(req.params.game_id).then(function(board) {
    //     res.render('individualGame', { board: board });
    // });
});


module.exports = router;