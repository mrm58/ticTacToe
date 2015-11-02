'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('users', 'emailKey', {type: Sequelize.STRING})
      .then(function() {
        require('../models').user.findAll().then(function(users) {
          // add code here to add emailKey values to all users who dont have one already
          users.forEach(function(user) {
            user.update({ emailKey: require('crypto').randomBytes(32).toString('hex') })
              .then(function(u) {
                if (u.email) {
                  require('../emails').sendUserVerificationEmail(u);
                }
              });
          });
        });
      });
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('users', 'emailKey');
  }
};
