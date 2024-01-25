const moment = require('moment-timezone');
moment.tz.setDefault('Asia/Tehran');


Now = () => {
    const tehranTimezone = moment.tz('Asia/Tehran').add(3, 'hours').add(30, 'minutes');
    return tehranTimezone.toDate();
}


TimeServices = {
    Now,
}

module.exports = TimeServices;