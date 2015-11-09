// routes/users.js
var express = require('express');
var router = express.Router();

var user = require('../models').user;

var accepts = {
  'json': 'application/json',
  'html': 'text/html'
};

router.param('format', function checkFormat(req, res, next, param) {
  req.headers.accept = accepts[param];
  next();
});

router.param('username', function(req, res, next) {
  user.findOne({ where: { username: req.params.username } })
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
  user.findOne({ where: { username: req.query.username }})
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
  var requestedPage = parseInt(req.query.page, 10) || 1;
  var userSearch = req.query.userSearch || '';
  userSearch = '%' + userSearch + '%';
  user.findAndCountAll({
    where: {
      username: {
        $like: userSearch
      }
    },
    attributes: ['id', 'username', 'email'],
    limit: 5,
    offset: (requestedPage - 1) * 5
  }).then(function(userList) {
      var jsonObj = { users: userList.rows };
      if (requestedPage > 1) {
        jsonObj.previousPage = requestedPage - 1;
      }
      if ((userList.count - 5) > ((requestedPage - 1) * 5)) {
        jsonObj.nextPage = 1 + requestedPage;
      }
    res.format({
      html: function() {
        res.render('users', jsonObj);
      },
      json: function() {
        res.json( jsonObj );
      }
    });
  });
});

router.post('/', function(req, res) {
  res.redirect('/users?userSearch' + req.body.userSearchText);
  //res.redirect('/?userSearch=' + req.body.userSearchText);
});

//Verify user section
router.get('/verify', function(req, res) {
  user.findOne( { where: {emailKey: req.query.k } } )
    .then(function(user) {
      if(user) {
        user.markVerified();
        req.session.user_id = user.id;
        req.session.save(function() {
          res.render('verified', { user: user });
        });
      } else {
        req.flash('warning', 'Verification key not found');
        res.redirect('/register');
      }
    });
});

//Individual user section
router.get('/:username.:format?', function(req, res) {
//router.get('/:username', function(req, res) {
  user.findOne({ where: { username: req.params.username } })
    .then(function(user) {
      res.format({
       html: function() {
          res.render('individualUser', { user: user });
       },
       json: function() {
         res.json(user);
       }
      });
  });
});



module.exports = router;