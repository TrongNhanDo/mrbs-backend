const dbConnect = require('../config/poolConnection');
const Constants = require('../common/constants');
const Utils = require('../common/utils');

/** Controller uses for getting all entries registered. */
const getAllEntries = (req, res) => {
   try {
      dbConnect.getConnection((err, connection) => {
         if (err) throw err;

         const { entry_id, username, create_by, registered } = req.body;
         const query = 'SELECT * FROM mrbs_entry ORDER BY start_time';
         connection.query(
            query,
            [entry_id, username, create_by, registered],
            (error, rows) => {
               if (!error) {
                  rows.map((value) => {
                     console.log({
                        start: Utils.uniTimeToDate(value.start_time),
                        end: Utils.uniTimeToDate(value.end_time),
                     });
                  });

                  connection.release();
                  return res.json({
                     returnCnt: rows ? rows.length : 0,
                     entries: rows || [],
                     bizResult: Constants.BizResult.Success,
                  });
               }

               connection.rollback();
               return res.json({
                  errors: error,
                  bizResult: Constants.BizResult.Fail,
               });
            }
         );
      });
   } catch (error) {
      throw error;
   }
};

/** Controller uses for adding entries depends on the repeat type. */
const addEntry = (req, res) => {
   try {
      dbConnect.getConnection((err, connection) => {
         if (err) throw err;

         const params = req.body;
         switch (params.rep_type) {
            case 0:
               return addEntryNoRepeat(params, res, connection);
            case 1:
               return addEntryRepeatDaily(params, res, connection);
            case 2:
               return addEntryRepeatWeek(params, res, connection);
            case 3:
               return addEntryRepeatMonth(params, res, connection);
            case 4:
               return addEntryRepeatYear(params, res, connection);
            default:
               return res.json({
                  message: 'rep_type is undefined.',
                  bizResult: Constants.BizResult.Fail,
               });
         }
      });
   } catch (error) {
      throw error;
   }
};

/** Function uses for adding entries when repeat type = 0 (None) */
const addEntryNoRepeat = (params, res, connection) => {
   const entryArray = [];

   params.room_id.map((value) => {
      const roomId = value;
      const startTime = Utils.getUnixTime(params.start_time);
      const endTime = Utils.getUnixTime(params.end_time);

      entryArray.push([
         startTime,
         endTime,
         params.entry_type || 0,
         roomId,
         params.create_by,
         params.modified_by || '',
         params.name,
         params.type,
         params.description || '',
         params.status || 0,
      ]);
   });

   const query =
      'INSERT INTO mrbs_entry (start_time, end_time, entry_type, room_id, create_by, modified_by, name, type, description, status) VALUES ?';
   connection.query(query, [entryArray], (error) => {
      if (!error) {
         connection.rollback();
         return res.json({
            message: 'Add entry successfully!',
            bizResult: Constants.BizResult.Success,
         });
      }

      connection.release();
      return res.json({
         errors: error,
         bizResult: Constants.BizResult.Fail,
      });
   });
};

/** Function uses for adding entries when repeat type = 1 (Daily) */
const addEntryRepeatDaily = (params, res, connection) => {
   const repeatArray = [];
   params.room_id.map((value) => {
      const roomId = value;
      const startTime = Utils.getUnixTime(params.start_time);
      const endTime = Utils.getUnixTime(params.end_time);
      const endDate = Utils.getUnixTime(params.end_date);

      repeatArray.push([
         startTime,
         endTime,
         params.rep_type,
         endDate,
         params.rep_opt,
         roomId,
         params.create_by,
         params.modified_by || '',
         params.name,
         params.type,
         params.description,
         params.rep_interval,
         params.status || 0,
         params.ical_ui || '',
         params.ical_sequence || 0,
         params.month_absolute || null,
         params.month_relative || null,
      ]);
   });

   const queryRepeat =
      'INSERT INTO mrbs_repeat (start_time, end_time, rep_type, end_date, rep_opt, room_id, create_by, modified_by, name, type, description, rep_interval, status, ical_uid, ical_sequence, month_absolute, month_relative) VALUES ?';
   connection.query(queryRepeat, [repeatArray], (error, rows) => {
      if (!error) {
         const repeatDay = Number(params.rep_interval) + 1;
         const repeatId = Number(rows.insertId);
         const recordAdded = rows.affectedRows;
         const periodTime =
            Utils.getUnixTime(params.end_time) -
            Utils.getUnixTime(params.start_time);
         let hasError = false;
         const errorArray = [];

         Array(recordAdded)
            .fill()
            .map((_, index1) => {
               const paramArray = [];
               Array(repeatDay)
                  .fill(0)
                  .map((_, index) => {
                     const startTime =
                        index === 0
                           ? Utils.getUnixTime(params.start_time)
                           : Utils.getUnixTime(
                                Utils.addDate(
                                   index,
                                   params.start_time,
                                   Constants.AddDateTypes.Day
                                )
                             );
                     paramArray.push([
                        startTime,
                        startTime + periodTime,
                        params.entry_type,
                        repeatId + index1,
                        params.room_id[index1],
                        params.create_by,
                        params.modified_by || '',
                        params.name,
                        params.type,
                        params.description,
                        params.status || 0,
                     ]);
                  });

               const queryEntry =
                  'INSERT INTO mrbs_entry (start_time, end_time, entry_type, repeat_id, room_id, create_by, modified_by, name, type, description, status) VALUES ?';
               connection.query(queryEntry, [paramArray], (err2) => {
                  if (err2) {
                     hasError = true;
                     errorArray.push(err2);

                     connection.rollback();
                     return res.json({
                        errors: errorArray,
                        bizResult: Constants.BizResult.Fail,
                     });
                  }
               });
            });

         if (!hasError) {
            connection.release();
            return res.json({
               message: 'Add entry successfully!',
               bizResult: Constants.BizResult.Success,
            });
         }

         connection.rollback();
         return res.json({
            errors: error,
            bizResult: Constants.BizResult.Fail,
         });
      } else {
         connection.rollback();
         return res.json({
            errors: error,
            bizResult: Constants.BizResult.Fail,
         });
      }
   });
};

/** Function uses for adding entries when repeat type = 2 (Weekly) */
const addEntryRepeatWeek = (params, res, connection) => {
   const repeatArray = [];
   params.room_id.map((value) => {
      const roomId = value;
      const startTime = Utils.getUnixTime(params.start_time);
      const endTime = Utils.getUnixTime(params.end_time);
      const endDate = Utils.getUnixTime(params.end_date);

      repeatArray.push([
         startTime,
         endTime,
         params.rep_type,
         endDate,
         params.rep_opt,
         roomId,
         params.create_by,
         params.modified_by || '',
         params.name,
         params.type,
         params.description,
         params.rep_interval,
         params.status || 0,
         params.ical_ui || '',
         params.ical_sequence || 0,
         params.month_absolute || null,
         params.month_relative || null,
      ]);
   });

   const queryRepeat =
      'INSERT INTO mrbs_repeat (start_time, end_time, rep_type, end_date, rep_opt, room_id, create_by, modified_by, name, type, description, rep_interval, status, ical_uid, ical_sequence, month_absolute, month_relative) VALUES ?';
   connection.query(queryRepeat, [repeatArray], (error, rows) => {
      if (!error) {
         const repeatYear = Number(params.rep_interval) + 1;
         const repeatId = Number(rows.insertId);
         const recordAdded = rows.affectedRows;
         const periodTime =
            Utils.getUnixTime(params.end_time) -
            Utils.getUnixTime(params.start_time);
         let hasError = false;
         const errorArray = [];

         Array(recordAdded)
            .fill()
            .map((_, index1) => {
               const paramArray = [];
               Array(repeatYear)
                  .fill(0)
                  .map((_, index) => {
                     const startTime =
                        index === 0
                           ? Utils.getUnixTime(params.start_time)
                           : Utils.getUnixTime(
                                Utils.addDate(
                                   index,
                                   params.start_time,
                                   Constants.AddDateTypes.Week
                                )
                             );
                     paramArray.push([
                        startTime,
                        startTime + periodTime,
                        params.entry_type,
                        repeatId + index1,
                        params.room_id[index1],
                        params.create_by,
                        params.modified_by || '',
                        params.name,
                        params.type,
                        params.description,
                        params.status || 0,
                     ]);
                  });

               const queryEntry =
                  'INSERT INTO mrbs_entry (start_time, end_time, entry_type, repeat_id, room_id, create_by, modified_by, name, type, description, status) VALUES ?';
               connection.query(queryEntry, [paramArray], (err2) => {
                  if (err2) {
                     hasError = true;
                     errorArray.push(err2);

                     connection.rollback();
                     return res.json({
                        errors: errorArray,
                        bizResult: Constants.BizResult.Fail,
                     });
                  }
               });
            });

         if (!hasError) {
            connection.release();
            return res.json({
               message: 'Add entry successfully!',
               bizResult: Constants.BizResult.Success,
            });
         }

         connection.rollback();
         return res.json({
            errors: error,
            bizResult: Constants.BizResult.Fail,
         });
      } else {
         connection.rollback();
         return res.json({
            errors: error,
            bizResult: Constants.BizResult.Fail,
         });
      }
   });
};

/** Function uses for adding entries when repeat type = 3 (Monthly) */
const addEntryRepeatMonth = (params, res, connection) => {
   const repeatArray = [];
   let monthAbsolute = null;
   let monthRelative = null;

   if (params.month_absolute) {
      monthAbsolute = params.month_absolute;
   }

   if (params.month_relative_ord && params.month_relative_day) {
      monthRelative = params.month_relative_ord + params.month_relative_day;
   }

   params.room_id.map((value) => {
      const roomId = value;
      const startTime = Utils.getUnixTime(params.start_time);
      const endTime = Utils.getUnixTime(params.end_time);
      const endDate = Utils.getUnixTime(params.end_date);

      repeatArray.push([
         startTime,
         endTime,
         params.rep_type,
         endDate,
         params.rep_opt,
         roomId,
         params.create_by,
         params.modified_by || '',
         params.name,
         params.type,
         params.description,
         params.rep_interval,
         params.status || 0,
         params.ical_ui || '',
         params.ical_sequence || 0,
         monthAbsolute,
         monthRelative,
      ]);
   });
   const queryRepeat =
      'INSERT INTO mrbs_repeat (start_time, end_time, rep_type, end_date, rep_opt, room_id, create_by, modified_by, name, type, description, rep_interval, status, ical_uid, ical_sequence, month_absolute, month_relative) VALUES ?';
   connection.query(queryRepeat, [repeatArray], (error, rows) => {
      if (!error) {
         const repeatYear = Number(params.rep_interval) + 1;
         const repeatId = Number(rows.insertId);
         const recordAdded = rows.affectedRows;
         const periodTime =
            Utils.getUnixTime(params.end_time) -
            Utils.getUnixTime(params.start_time);
         let hasError = false;
         const errorArray = [];
         const startDate = new Date(params.start_time);
         startDate.setDate(1);

         Array(recordAdded)
            .fill()
            .map((_, index1) => {
               const paramArray = [];
               Array(repeatYear)
                  .fill(0)
                  .map((_, index) => {
                     let startTime = '';
                     // use for monthly date
                     if (monthAbsolute) {
                        if (index === 0) {
                           startTime = Utils.getUnixTime(params.start_time);
                        } else {
                           const nextDate = Utils.addDate(
                              index,
                              params.start_time,
                              Constants.AddDateTypes.Month
                           );

                           if (nextDate.getDate() === monthAbsolute) {
                              startTime = Utils.getUnixTime(nextDate);
                           }
                        }
                     }

                     // use for monthly day
                     if (monthRelative) {
                        let newMonth = startDate;
                        if (index !== 0) {
                           newMonth = Utils.addDate(
                              index,
                              startDate,
                              Constants.AddDateTypes.Month
                           );
                        }
                        // all days of month
                        const allDays = Utils.getAllDayOfWeek(
                           newMonth,
                           params.month_relative_day
                        );
                        // target date
                        const targetDate =
                           allDays[params.month_relative_ord - 1];

                        if (allDays && targetDate) {
                           startTime = Utils.getUnixTime(targetDate);
                        }
                     }

                     if (startTime && startTime !== '') {
                        paramArray.push([
                           startTime,
                           startTime + periodTime,
                           params.entry_type,
                           repeatId + index1,
                           params.room_id[index1],
                           params.create_by,
                           params.modified_by || '',
                           params.name,
                           params.type,
                           params.description,
                           params.status || 0,
                        ]);
                     }
                  });

               const queryEntry =
                  'INSERT INTO mrbs_entry (start_time, end_time, entry_type, repeat_id, room_id, create_by, modified_by, name, type, description, status) VALUES ?';
               connection.query(queryEntry, [paramArray], (err2) => {
                  if (err2) {
                     hasError = true;
                     errorArray.push(err2);

                     connection.rollback();
                     return res.json({
                        errors: errorArray,
                        bizResult: Constants.BizResult.Fail,
                     });
                  }
               });
            });

         if (!hasError) {
            connection.release();
            return res.json({
               message: 'Add entry successfully!',
               bizResult: Constants.BizResult.Success,
            });
         }

         connection.rollback();
         return res.json({
            errors: error,
            bizResult: Constants.BizResult.Fail,
         });
      } else {
         connection.rollback();
         return res.json({
            errors: error,
            bizResult: Constants.BizResult.Fail,
         });
      }
   });
};

/** Function uses for adding entries when repeat type = 4 (Yearly) */
const addEntryRepeatYear = (params, res, connection) => {
   const repeatArray = [];
   params.room_id.map((value) => {
      const roomId = value;
      const startTime = Utils.getUnixTime(params.start_time);
      const endTime = Utils.getUnixTime(params.end_time);
      const endDate = Utils.getUnixTime(params.end_date);

      repeatArray.push([
         startTime,
         endTime,
         params.rep_type,
         endDate,
         params.rep_opt,
         roomId,
         params.create_by,
         params.modified_by || '',
         params.name,
         params.type,
         params.description,
         params.rep_interval,
         params.status || 0,
         params.ical_ui || '',
         params.ical_sequence || 0,
         params.month_absolute || null,
         params.month_relative || null,
      ]);
   });

   const queryRepeat =
      'INSERT INTO mrbs_repeat (start_time, end_time, rep_type, end_date, rep_opt, room_id, create_by, modified_by, name, type, description, rep_interval, status, ical_uid, ical_sequence, month_absolute, month_relative) VALUES ?';
   connection.query(queryRepeat, [repeatArray], (error, rows) => {
      if (!error) {
         const repeatYear = Number(params.rep_interval) + 1;
         const repeatId = Number(rows.insertId);
         const recordAdded = rows.affectedRows;
         const periodTime =
            Utils.getUnixTime(params.end_time) -
            Utils.getUnixTime(params.start_time);
         const startDateInput = new Date(params.start_time).getDate();
         let hasError = false;
         const errorArray = [];

         Array(recordAdded)
            .fill()
            .map((_, index1) => {
               const paramArray = [];
               Array(repeatYear)
                  .fill(0)
                  .map((_, index) => {
                     let startTime = '';
                     if (index === 0) {
                        startTime = Utils.getUnixTime(params.start_time);
                     } else {
                        const nextYear = Utils.addDate(
                           index,
                           params.start_time,
                           Constants.AddDateTypes.Year
                        );

                        if (nextYear.getDate() === startDateInput) {
                           startTime = Utils.getUnixTime(nextYear);
                        }
                     }

                     if (startTime && startTime !== '') {
                        paramArray.push([
                           startTime,
                           startTime + periodTime,
                           params.entry_type,
                           repeatId + index1,
                           params.room_id[index1],
                           params.create_by,
                           params.modified_by || '',
                           params.name,
                           params.type,
                           params.description,
                           params.status || 0,
                        ]);
                     }
                  });

               const queryEntry =
                  'INSERT INTO mrbs_entry (start_time, end_time, entry_type, repeat_id, room_id, create_by, modified_by, name, type, description, status) VALUES ?';
               connection.query(queryEntry, [paramArray], (err2) => {
                  if (err2) {
                     hasError = true;
                     errorArray.push(err2);

                     connection.rollback();
                     return res.json({
                        errors: errorArray,
                        bizResult: Constants.BizResult.Fail,
                     });
                  }
               });
            });

         if (!hasError) {
            connection.release();
            return res.json({
               message: 'Add entry successfully!',
               bizResult: Constants.BizResult.Success,
            });
         }

         connection.rollback();
         return res.json({
            errors: error,
            bizResult: Constants.BizResult.Fail,
         });
      } else {
         connection.rollback();
         return res.json({
            errors: error,
            bizResult: Constants.BizResult.Fail,
         });
      }
   });
};

/** Controller uses for update entry */
const updateEntry = (req, res) => {
   try {
      dbConnect.getConnection((error, connection) => {
         if (error) throw error;

         const params = req.body;
         let hasError = false;
         let errorArray = [];
         params.room_id.map((value) => {
            const queryUpdate =
               'UPDATE mrbs_entry SET name = ?, description = ?, start_time = ?, end_time = ?, room_id = ?, type = ?, status = ? WHERE id = ?';
            connection.query(
               queryUpdate,
               [
                  params.name,
                  params.description,
                  Utils.getUnixTime(params.start_time),
                  Utils.getUnixTime(params.end_time),
                  value,
                  params.type,
                  params.status,
                  params.id,
               ],
               (err) => {
                  if (err) {
                     hasError = true;
                     errorArray.push(err);
                     connection.rollback();

                     return res.json({
                        errors: err,
                        bizResult: Constants.BizResult.Fail,
                     });
                  }
               }
            );
         });

         if (hasError) {
            connection.rollback();
            return res.json({
               errors: errorArray,
               bizResult: Constants.BizResult.Fail,
            });
         } else {
            connection.release();
            return res.json({
               message: 'Update entry successfully!',
               bizResult: Constants.BizResult.Success,
            });
         }
      });
   } catch (error) {
      return res.json({
         errors: error,
         bizResult: Constants.BizResult.Fail,
      });
   }
};

/** Controller uses for delete entry */
const deleteEntry = (req, res) => {
   try {
      const params = req.body;
      dbConnect.getConnection((err, connection) => {
         if (err) throw err;

         if (params.entry_id) {
            const query = 'DELETE FROM mrbs_entry WHERE id = ?';
            connection.query(query, [params.entry_id], (error) => {
               if (!err) {
                  connection.release();
                  res.json({
                     message: 'Delete entry based on entryId successfully!',
                     bizResult: Constants.BizResult.Success,
                  });
               } else {
                  connection.rollback();
                  res.json({
                     errors: error,
                     bizResult: Constants.BizResult.Fail,
                  });
               }
            });
         } else if (params.repeat_id) {
            const query =
               'DELETE a, b FROM mrbs_repeat a LEFT JOIN mrbs_entry b ON a.id = b.repeat_id WHERE a.id = ?';
            connection.query(query, [params.repeat_id], (error) => {
               if (!err) {
                  connection.release();
                  res.json({
                     message: 'Delete entry based on repeatId successfully!',
                     bizResult: Constants.BizResult.Success,
                  });
               } else {
                  connection.rollback();
                  res.json({
                     errors: error,
                     bizResult: Constants.BizResult.Fail,
                  });
               }
            });
         }

         return res.json({
            message: 'EntryId or RepeatId is undefined.',
            bizResult: Constants.BizResult.Fail,
         });
      });
   } catch (error) {
      throw error;
   }
};

module.exports = {
   getAllEntries,
   addEntry,
   updateEntry,
   deleteEntry,
};