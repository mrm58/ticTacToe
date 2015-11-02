// routes/admin.js

var express = require('express');
var router = express.Router();
var roles = require('../roles');

router.use(roles.can('access admin page'));

router.get('/', function(req, res) {
  res.send('Hi admin!');
});

module.exports = router;