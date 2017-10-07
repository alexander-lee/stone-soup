'use strict';

const CronJob = require('cron').CronJob;
const notificationsWorker = require('./message-factory');
const moment = require('moment');

const schedulerFactory = function(startDate) {
  const m = moment(startDate, 'HH:mm').subtract(1, 'minutes');

  return {
    start: function() {
      new CronJob('00 ' + m.getMinutes() + ' ' + m.getHours() + ' * * 6', function() {
        console.log('Running Send Notifications Worker for ' +
          moment().format());
        notificationsWorker.run();
      }, null, true, 'America/Los_Angeles');
    },
  };
};

export default schedulerFactory;