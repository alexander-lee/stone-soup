'use strict';

const CronJob = require('cron').CronJob;
const notificationsWorker = require('./message-factory');
const moment = require('moment');

const schedulerFactory = function(startDate, day, jobID) {
  const m = moment(startDate, 'HH:mm').subtract(1, 'minutes');
  return {
    start: function() {
      new CronJob('00 ' + m.minutes() + ' ' + m.hours() + ' * * ' + day, function() {
        console.log('Running Send Notifications Worker for ' +
          moment().format());
        notificationsWorker.run(jobID);
      }, null, true, 'America/Los_Angeles');
    },
  };
};

export default schedulerFactory;