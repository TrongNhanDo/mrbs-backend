const DateFns = require('date-fns');
const Constants = require('./constants');

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

const getAllDayOfWeek = (date, day) => {
   let d = new Date(date);
   let month = d.getMonth();
   let dayArray = [];
   // start on the first day
   d.setDate(1);

   let dayOfWeek = '';
   switch (day) {
      case Constants.DayOfWeekTypes.Monday:
         dayOfWeek = 1;
         break;
      case Constants.DayOfWeekTypes.Tuesday:
         dayOfWeek = 2;
         break;
      case Constants.DayOfWeekTypes.Wednesday:
         dayOfWeek = 3;
         break;
      case Constants.DayOfWeekTypes.Thursday:
         dayOfWeek = 4;
         break;
      case Constants.DayOfWeekTypes.Friday:
         dayOfWeek = 5;
         break;
      case Constants.DayOfWeekTypes.Saturday:
         dayOfWeek = 6;
         break;
      case Constants.DayOfWeekTypes.Sunday:
         dayOfWeek = 0;
         break;
      default:
         dayOfWeek = '';
   }

   if (dayOfWeek !== '') {
      // Get the first day in the month
      while (d.getDay() !== dayOfWeek) {
         d.setDate(d.getDate() + 1);
      }

      // Get all the other days in the month
      while (d.getMonth() === month) {
         dayArray.push(new Date(d.getTime()));
         d.setDate(d.getDate() + 7);
      }

      return dayArray;
   }

   return [];
};

module.exports = {
   checkEmpty,
   getUnixTime,
   uniTimeToDate,
   addDate,
   getAllDayOfWeek,
};
