import * as Constants from '../../common/constants';

export enum RepeatTypes {
   None = 0,
   Daily = 1,
   Weekly = 2,
   Monthly = 3,
   Yearly = 4,
}

export type EntryInputProps = {
   start_time: string;
   end_time: string;
   end_date: string;
   rep_type: RepeatTypes;
   rep_opt: string;
   rep_interval: number;
   rep_day?: number[];
   room_id: number[];
   entry_type: number;
   create_by: string;
   modified_by: string;
   name: string;
   type: string;
   description: string;
   status: number;
   ical_ui: string;
   ical_sequence: string;
   month_absolute: number;
   month_relative_ord: number;
   month_relative_day: Constants.DayOfWeekTypes;
};
