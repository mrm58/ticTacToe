var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var models = require('./models');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var Sequelize = require('sequelize');
var SequelizeStore = require('connect-session-sequelize')(session.Store);

var sequelize = new Sequelize(
  "database",
  "username",
  "password", {
    "dialect": "sqlite",
    "storage": "./store/session.sqlite"
  });

var store = new SequelizeStore({ db: sequelize });
store.sync();


app.use(cookieParser());
app.use(session({
    saveUninitialized: false,
    resave: false,
    secret: 'I see dead people',
    store: store
}));

app.use(require('flash')());

app.use('/bower_components',
        express.static(__dirname + '/bower_components'));
app.use('/public', express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded( {extended: false} ));

app.set('view engine', 'jade');

app.use(require('./routes'));


//Login page -> game w/ session
// /users list
//logout page -> req.session.destroy(function(){...})
//req.params uses parameters on the URL
//req.body uses parameters that are passed via the post

var server = app.listen(3000, function()
{
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});