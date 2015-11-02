//models/board.js
'use strict';

module.exports = function(sequelize, DataTypes) {
  var board = sequelize.define('board', {
      board: {
          type: DataTypes.STRING,
          get: function() {
              return this.getDataValue('board')
                .match(/.{3}/g)
                .map(function(row) {
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
          // set: function(boardArray) {
          //     this.setDataValue(boardArray.map(function(row) { return row.join(''); } ).join(''));
          // }
      }
  },
  {
    classMethods: {
      associate: function(models) {
        board.belongsTo(models.user, { as: 'XPlayer', foreignKey: 'xPlayerId' });
        board.belongsTo(models.user, { as: 'OPlayer', foreignKey: 'oPlayerId' });
      }
    },
    instanceMethods: {
      isOpenForJoining: function() {
        return !this.xPlayerId || !this.oPlayerId;
      },
      isPlayer: function(user) {
        return this.xPlayerId == user.id || this.oPlayerId == user.id;
      },
      getPlayerXid: function() {
        return this.xPlayerId;
      },
      getPlayerOid: function() {
        return this.oPlayerId;
      }
    },
    scopes: {
      stale: function() {
        return {
          where: {
            updatedAt: {
              $lt: new Date((new Date()) - 24 * 60 * 60 * 1000 * 7)
            }
          }
        };
      },
      withUsers: function() {
        return {
          include: [
            { association: board.associations.XPlayer },
            { association: board.associations.OPlayer }
          ]
        };
      },
      available: {
        where: {
          $or: [
            { xPlayerId: null },
            { oPlayerId: null }
          ]
        }
      },
      forUser: function(u) {
        return {
          where: {
            $or: [
              { xPlayerId: u.id },
              { oPlayerId: u.id }
            ]
          }
        };
      }
    }
  });
  return board;
};
