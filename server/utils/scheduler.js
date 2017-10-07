'use strict';

const CronJob = require('cron').CronJob;
const notificationsWorker = require('./message-factory');
const moment = require('moment');

const schedulerFactory = function(startDate) {
  return {
    start: function() {
      const m = moment(startDate).subtract(30, 'minutes');
      new CronJob('00 ' + m.getMinutes() + ' ' + m.getHours() + ' * * *', function() {
        console.log('Running Send Notifications Worker for ' +
          moment().format());
        notificationsWorker.run();
      }, null, true, '');
    },
  };
};

module.exports = schedulerFactory();