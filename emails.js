'use strict';

var models = require('./models');

var SparkPost = require('sparkpost');

var client = new SparkPost(); // uses process.env.SPARKPOST_API_KEY
var from = 'test@msquared.bewd-fall15.com'; //

var host_url = 'http://aqueous-eyrie-9609.herokuapp.com/';

var txResponseHandler = function txResponseHandler(err, data) {
  if(err) {
    console.error('ERROR: ', err);
    new Error(err);
  } else {
    console.log('WOOHOO, Transmission accepted by SparkPost!');
    //console.log(data);
  }
};

function sendUserVerificationEmail(user) {
  var txObject = {
    transmissionBody: {
      campaign: 'email-verification',
      content: {
        from: from,
        subject: 'Please verify your email address',
        text: 'Hello ' + user.username + ' thank you for registering to play TicTacToe.  Please verify your account at ' + host_url + 'users/verify?k=' + user.emailKey
      },
      recipients: [ { address: user.email } ]
    }
  };

  // var txResponseHandler = function txResponseHandler(err, data) {
  //   if(err) {
  //     console.error('ERROR: ', err);
  //     new Error(err);
  //   } else {
  //     console.log('WOOHOO, Transmission accepted by SparkPost!');
  //     console.log(data);
  //   }
  // };

  // Simplify sending transmission and response handling using the SparkPost Node SDK Transmission request
  client.transmissions.send(txObject, txResponseHandler);
}

function sendReminderEmails(boards) {
  for(var board in boards) {
    var playerX = models.user.findOne({ where: { id: board.getPlayerXid() }});
    var playerO = models.user.findOne({ where: { id: board.getPlayerOid() }});
    var txObject = {
      transmissionBody: {
        campaign: 'email-verification',
        content: {
          from: from,
          subject: 'We miss you!',
          text: 'Hello ' + host_url + ' you haven\'t made a move in a while.  Do you still want to play?  If so, make your next move at ' + host_url + 'games/' + board.id
        },
        recipients: [ { address: playerX.email } ]
      }
    };

    // var txResponseHandler = function txResponseHandler(err, data) {
    //   if(err) {
    //     console.error('ERROR: ', err);
    //     new Error(err);
    //   } else {
    //     console.log('WOOHOO, Transmission accepted by SparkPost!');
    //     console.log(data);
    //   }
    // };

    // Simplify sending transmission and response handling using the SparkPost Node SDK Transmission request
    client.transmissions.send(txObject, txResponseHandler);
  }
}

module.exports = {
  sendUserVerificationEmail: sendUserVerificationEmail,
  sendReminderEmails: sendReminderEmails
};
