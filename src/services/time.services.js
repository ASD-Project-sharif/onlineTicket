const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Tehran');

now = () => {
  const tehranTimezone = moment.tz('Asia/Tehran')
      .add(3, 'hours')
      .add(30, 'minutes');
  return tehranTimezone.toDate();
};

oneDayBeforeAfter = () => {
  const oneDayInMillis = 24 * 60 * 60 * 1000;
  const oneDayAfter = new Date(Date.now() + oneDayInMillis);
  return oneDayAfter
};

TimeServices = {
  now,
  oneDayBeforeAfter,
};

module.exports = TimeServices;
