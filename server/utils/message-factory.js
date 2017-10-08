'use strict';

const Restaurant = require('../models/restaurant');

const notificationWorkerFactory = function() {
  return {
    run: function(jobID) {
      Restaurant.sendNotifications(jobID);
    },
  };
};

module.exports = notificationWorkerFactory();