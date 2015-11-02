
var models = require('../models');
var emails = require('../emails');

models.board.scope('stale').findAll().then(function(boards) {
  if(boards) {
    emails.sendReminderEmails(boards);
  }
});