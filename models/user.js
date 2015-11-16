'use strict';
module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define('user', {
    username: DataTypes.STRING,
    // username: {
    //   //DataTypes.STRING,
    //   validate: {
    //     len: {
    //       args: [2, 32],
    //       msg: 'Username must be between 2 and 32 characters'
    //     },
    //     isAlphanumeric: {
    //       args: true,
    //       msg: 'Username must contain only letters or numbers'
    //     },
    //     notNull: true
    //   }
    // },
    password: {
      type: DataTypes.STRING,
      // validate: {
      //   notNull: true
      // }
    },
    banned: DataTypes.BOOLEAN,
    email: DataTypes.STRING,
    emailKey: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        user.hasMany(models.board, { as: 'XPlayer', foreignKey: 'xPlayerId' });
        user.hasMany(models.board, { as: 'OPlayer', foreignKey: 'oPlayerId' });
      },
      findByEmailKey: function(key) {
        return user.find( { emailKey: key } );
      }
    },
    instanceMethods: {
      getBoards: function() {
        return sequelize.Promise.all([
          (this.XPlayer || this.getXPlayer()),
          (this.OPlayer || this.getOPlayer())
        ]).then(function(boards) {
          return boards.reduce(function(a, b) { return a.concat(b); }, []);
        });
      },
      isEmailVerified: function() {
        return !this.emailKey;
      },
      markVerified: function() {
        return this.update( { emailKey: null } );
      }
    },
    scopes: {
      knownValues: {
        where: {
          id: 1
        }
      },
      withBoards: function() {
        return {
          include: [
            { association: user.associations.XPlayer },
            { association: user.associations.OPlayer }
          ]
        };
      }
    },
    hooks: {
      beforeCreate: function(user) {
        user.emailKey = require('crypto').randomBytes(32).toString('hex');
      },
      afterCreate: [
        function(user) {
          console.log('Created user: ', user.username);
          console.log('I am sending an email to user with ', user.emailKey);
          //require('../emails').sendUserVerificationEmail(user);
        }
      ]
    }
  });
  return user;
};