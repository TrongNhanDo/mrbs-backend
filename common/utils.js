const DateFns = require('date-fns');
const Constants = require('../common/constants');

const checkEmpty = (value) => {
   if (value) {
      return value;
   }

   return '';
};

const getUnixTime = (date) => {
   if (date) {
      return DateFns.getUnixTime(new Date(date));
   }

   return DateFns.getUnixTime(new Date());
};

const uniTimeToDate = (unixTime) => {
   return new Date(
      DateFns.format(new Date(unixTime * 1000), 'yyyy-MM-dd HH:mm:ss')
   );
};

const addDate = (number, date, type) => {
   switch (type) {
      case Constants.AddDateTypes.Year:
         return new Date(
            new Date(date).setFullYear(
               new Date(date).getFullYear() + Number(number)
            )
         );
      case Constants.AddDateTypes.Month:
         return new Date(
            new Date(date).setMonth(new Date(date).getMonth() + Number(number))
         );
      case Constants.AddDateTypes.Week:
         return new Date(
            new Date(date).setDate(
               new Date(date).getDate() + Number(number * 7)
            )
         );
      case Constants.AddDateTypes.Day:
         return new Date(
            new Date(date).setDate(new Date(date).getDate() + Number(number))
         );
      default:
         return date;
   }
};

module.exports = {
   checkEmpty,
   getUnixTime,
   uniTimeToDate,
   addDate,
};
