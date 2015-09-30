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
app.use('/public', express.static(__dirname + '/public'))

app.use(bodyParser.urlencoded( {extended: false} ));

app.set('view engine', 'jade');

app.get('/', function(req, res) {
  //res.send('Hello world!');
  res.render('index');
});

app.get('/game', function(req,res) {
  console.log(req.query);
  var playerName = req.session.playerName;
  res.render('game', { username: playerName });
});

app.post('/game', function(req, res) {
    req.session.playerName = req.body.username;
    req.session.save(function() {
      res.redirect('/game');
    });
});

app.get('/games', function(req, res) {
    models.Board.findAll().then(function(boards) {
        if (req.session.user_id) {
          models.User.findById(req.session.user_id).then(function(user) {
            res.render('games', { boards: boards, user: user });
          })
        }
            // res.render('games', { boards: boards });
    });
});

app.post('/games', function(req, res) {
    models.Board.create({ board: req.body.board })
        .then(function(board) {
            res.redirect('/games/' + board.id);
        })
        .catch(function(errors) {
            models.Board.findAll().then(function(boards) {
                res.render('games', { boards: boards, errors: errors });
            });
            //req.alert('Initial board state must consiste of exactly 9 characters of which only [XO ] are allowed');
            //res.send(JSON.stringify(errors));
        });
});

app.get('/games/:game_id', function(req, res) {
    models.Board.findById(req.params.game_id).then(function(board) {
        res.render('individualGame', { board: board });
    });
});

// app.post('/games/:game_id', function(req, res) {
//     models.Board.findById(req.params.game_id).then(function(board) {
//         board.updateAttributes({
//             board: req.params.board
//         });
//     });
//     // models.Board.update({id: req.body.board.id, board: req.body.board })
//     //     .then(function(board) {
//     //         res.redirect('/games/');
//     //     })
// });

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