import * as DateFns from 'date-fns';
import * as Constants from '../common/constants';

export const checkEmpty = (value: any) => {
   if (value) {
      return value;
   }

   return '';
};

export const getUnixTime = (date: string | Date | number) => {
   if (date) {
      return DateFns.getUnixTime(new Date(date));
   }

   return DateFns.getUnixTime(new Date());
};

export const uniTimeToDate = (unixTime: number | string) => {
   return new Date(
      DateFns.format(new Date(Number(unixTime) * 1000), 'yyyy-MM-dd HH:mm:ss')
   );
};

export const addDate = (
   number: number,
   date: string | Date | number,
   type: Constants.AddDateTypes
) => {
   if (!isValidDate(date)) {
      return new Date();
   }

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
         return new Date(date);
   }
};

export const getAllDayOfWeek = (date: string | Date | number, day: string) => {
   let d = new Date(date);
   let month = d.getMonth();
   let dayArray = [];
   // start on the first day
   d.setDate(1);

   let dayOfWeek = '';
   switch (day) {
      case Constants.DayOfWeekTypes.Monday:
         dayOfWeek = '1';
         break;
      case Constants.DayOfWeekTypes.Tuesday:
         dayOfWeek = '2';
         break;
      case Constants.DayOfWeekTypes.Wednesday:
         dayOfWeek = '3';
         break;
      case Constants.DayOfWeekTypes.Thursday:
         dayOfWeek = '4';
         break;
      case Constants.DayOfWeekTypes.Friday:
         dayOfWeek = '5';
         break;
      case Constants.DayOfWeekTypes.Saturday:
         dayOfWeek = '6';
         break;
      case Constants.DayOfWeekTypes.Sunday:
         dayOfWeek = '0';
         break;
      default:
         dayOfWeek = '';
   }

   if (dayOfWeek !== '') {
      // Get the first day in the month
      while (d.getDay().toString() !== dayOfWeek) {
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

export const isValidDate = (date: string | Date | number) => {
   let check = false;

   const newDate = new Date(date);

   if (isNaN(newDate.getTime())) {
      check = false;
   } else {
      check = true;
   }

   return check;
};

export const getWeekByDate = (
   date: string | Date | number,
   fromMonday?: boolean
) => {
   var week = [];
   const current = date ? new Date(date) : new Date();
   // Starting Sunday (Monday => first + 1)
   current.setDate(current.getDate() - current.getDay() + (fromMonday ? 1 : 0));
   for (var i = 0; i < 7; i++) {
      week.push(new Date(current));
      current.setDate(current.getDate() + 1);
   }
   return week;
};

export const isBeforeDate = (
   date: string | Date | number,
   dateCompare: string | Date | number
) => {
   return DateFns.isBefore(new Date(date), new Date(dateCompare));
};

export const isAfterDate = (
   date: string | Date | number,
   dateCompare: string | Date | number
) => {
   return DateFns.isAfter(new Date(date), new Date(dateCompare));
};

export const isEqualDate = (
   date: string | Date | number,
   dateCompare: string | Date | number
) => {
   return new Date(date) === new Date(dateCompare);
};
