'use strict';
module.exports = function(sequelize, DataTypes) {
  var Board = sequelize.define('Board', {
    board: {
      type: DataTypes.STRING,
      get: function() {
        return this.getDataValue('board').match(/.{3}/g).map(function(row) {
          return row.split('');
        });
      },
      validate: {
        len: 9,
        is: {
          args: /^[XO ]+$/,
          msg: 'Must be a valid tic tac toe board'
        }
      }
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Board;
};

//var models = require('./models');
//models.Board.create({ board: 'OOOOOO' }).catch(function(res){console.log("Failed!", res); });