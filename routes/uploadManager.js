var options = {
  tmpDir:  __dirname + '/../public/uploaded/tmp',
  uploadDir: __dirname + '/../public/uploaded/files',
  uploadUrl:  '/uploaded/files/',
  storage : {
    type : 'local'
  }
};

var uploader = require('blueimp-file-upload-expressjs')(options);
var fs = require('fs');
var user = require('../models').user;
var board = require('../models').board;

module.exports = function (router) {
  router.post('/upload-pic', function (req, res) {
    uploader.post(req, res, function (err, obj) {
      res.json(obj);
    });
  });

  router.post('/upload-board', function (req, res) {
    uploader.post(req, res, function (err, obj) {
      var file = obj.files[0];
      
      var filePath = file.options.uploadDir + '/' + file.name;
      fs.readFile(filePath, 'utf8', function (err, data) {
        data = data.replace(/\r?\n|\r/g, '');
        console.log(data);
        board.create({board: data})
          .then(function(newBoard) {
            res.redirect('/game/' + newBoard.id);
          });
        //res.send(data);
      });

    });
  });
  
  return router;
};