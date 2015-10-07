
var express = require('express');
var router = express.Router();

var User = require('../models').User;

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

module.exports = router;