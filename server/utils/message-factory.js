'use strict';

const Restaurant = require('../models/restaurant');

const notificationWorkerFactory = function() {
  return {
    run: function() {
      Restaurant.sendNotifications();
    },
  };
};

module.exports = notificationWorkerFactory();