var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var models = require('./models');

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
  res.render('game', req.query)
});

app.post('/game', function(req, res) {
	res.redirect('/game?username=' + req.body.username)
//	res.render('game', req.body);
});

app.get('/games', function(req, res) {
	models.Board.findAll().then(function(boards) {
		res.render('games', {boards: boards });
	});
});

app.get('/games/:game_id', function(req, res) {
	models.Board.findById(req.params.game_id).then(function(board) {
		res.render('individualGame', { board: board });
	});
});

app.post('/games', function(req, res) {
	models.Board.create({ board: req.body.board })
		.then(function(board) {
			res.redirect('/games/' + board.id);
		})
		.catch(function(errors) {
			res.send(JSON.stringify(errors));
		});
});

var server = app.listen(3000, function() 
{
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});