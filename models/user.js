'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
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
    password: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return User;
};