const dbConnect = require('../config/poolConnection');
const Constants = require('../common/constants');
const Utils = require('../common/utils');

/** Controller uses for getting all entries registered. */
const getAllEntries = (req, res) => {
   try {
      dbConnect.getConnection((err, connection) => {
         if (err) throw err;

         const { entry_id, username, create_by, registered } = req.body;
         const query = 'SELECT * FROM mrbs_entry';
         connection.query(
            query,
            [entry_id, username, create_by, registered],
            (error, rows) => {
               connection.release();
               if (!error) {
                  rows.map((value) => {
                     console.log({
                        start: Utils.uniTimeToDate(value.start_time),
                        end: Utils.uniTimeToDate(value.end_time),
                     });
                  });
                  return res.json({
                     returnCnt: rows ? rows.length : 0,
                     entries: rows || [],
                     bizResult: Constants.BizResult.Success,
                  });
               }

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
                  bizResult: Constants.BizResult.Success,
               });
         }
      });
   } catch (error) {
      throw error;
   }
};

/** Function uses for adding entries when repeat type = 0 (None) */
const addEntryNoRepeat = (params, res, connection) => {
   const query =
      'INSERT INTO mrbs_entry (start_time, end_time, entry_type, room_id, create_by, modified_by, name, type, description, status) VALUES ?';
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

   connection.query(query, [entryArray], (error, rows) => {
      connection.release();
      if (!error) {
         return res.json({
            message: 'Add entry successfully!',
            bizResult: Constants.BizResult.Success,
         });
      }

      return res.json({
         errors: error,
         bizResult: Constants.BizResult.Fail,
      });
   });
};

/** Function uses for adding entries when repeat type = 1 (Daily) */
const addEntryRepeatDaily = (params, res, connection) => {
   const queryRepeat =
      'INSERT INTO mrbs_repeat (start_time, end_time, rep_type, end_date, rep_opt, room_id, create_by, modified_by, name, type, description, rep_interval, status, ical_uid, ical_sequence, month_absolute, month_relative) VALUES ?';
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
   connection.query(queryRepeat, [repeatArray], (error, rows) => {
      connection.release();
      if (!error) {
         const repeatDay = Number(params.rep_interval || 0);
         const repeatId = Number(rows.insertId);
         const recordAdded = rows.affectedRows;
         const periodTime =
            Utils.getUnixTime(params.end_time) -
            Utils.getUnixTime(params.start_time);
         const queryEntry =
            'INSERT INTO mrbs_entry (start_time, end_time, entry_type, repeat_id, room_id, create_by, modified_by, name, type, description, status) VALUES ?';
         let hasError = false;

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
               connection.query(queryEntry, [paramArray], (err2, rows2) => {
                  if (err2) {
                     hasError = true;
                  }
               });
            });

         if (!hasError) {
            return res.json({
               message: 'Add entry successfully!',
               bizResult: Constants.BizResult.Success,
            });
         }

         return res.json({
            errors: error,
            bizResult: Constants.BizResult.Fail,
         });
      } else {
         return res.json({
            errors: error,
            bizResult: Constants.BizResult.Fail,
         });
      }
   });
};

/** Function uses for adding entries when repeat type = 2 (Weekly) */
const addEntryRepeatWeek = (params, res, connection) => {
   const queryRepeat =
      'INSERT INTO mrbs_repeat (start_time, end_time, rep_type, end_date, rep_opt, room_id, create_by, modified_by, name, type, description, rep_interval, status, ical_uid, ical_sequence, month_absolute, month_relative) VALUES ?';
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
   connection.query(queryRepeat, [repeatArray], (error, rows) => {
      connection.release();
      if (!error) {
         const repeatYear = Number(params.rep_interval || 0);
         const repeatId = Number(rows.insertId);
         const recordAdded = rows.affectedRows;
         const periodTime =
            Utils.getUnixTime(params.end_time) -
            Utils.getUnixTime(params.start_time);
         const queryEntry =
            'INSERT INTO mrbs_entry (start_time, end_time, entry_type, repeat_id, room_id, create_by, modified_by, name, type, description, status) VALUES ?';
         let hasError = false;

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
               connection.query(queryEntry, [paramArray], (err2, rows2) => {
                  if (err2) {
                     hasError = true;
                  }
               });
            });

         if (!hasError) {
            return res.json({
               message: 'Add entry successfully!',
               bizResult: Constants.BizResult.Success,
            });
         }

         return res.json({
            errors: error,
            bizResult: Constants.BizResult.Fail,
         });
      } else {
         return res.json({
            errors: error,
            bizResult: Constants.BizResult.Fail,
         });
      }
   });
};

/** Function uses for adding entries when repeat type = 3 (Monthly) */
const addEntryRepeatMonth = (params, res, connection) => {
   const queryRepeat =
      'INSERT INTO mrbs_repeat (start_time, end_time, rep_type, end_date, rep_opt, room_id, create_by, modified_by, name, type, description, rep_interval, status, ical_uid, ical_sequence, month_absolute, month_relative) VALUES ?';
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
   connection.query(queryRepeat, [repeatArray], (error, rows) => {
      connection.release();
      if (!error) {
         const repeatYear = Number(params.rep_interval || 0);
         const repeatId = Number(rows.insertId);
         const recordAdded = rows.affectedRows;
         const periodTime =
            Utils.getUnixTime(params.end_time) -
            Utils.getUnixTime(params.start_time);
         const queryEntry =
            'INSERT INTO mrbs_entry (start_time, end_time, entry_type, repeat_id, room_id, create_by, modified_by, name, type, description, status) VALUES ?';
         let hasError = false;

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
                                   Constants.AddDateTypes.Month
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
               connection.query(queryEntry, [paramArray], (err2, rows2) => {
                  if (err2) {
                     hasError = true;
                  }
               });
            });

         if (!hasError) {
            return res.json({
               message: 'Add entry successfully!',
               bizResult: Constants.BizResult.Success,
            });
         }

         return res.json({
            errors: error,
            bizResult: Constants.BizResult.Fail,
         });
      } else {
         return res.json({
            errors: error,
            bizResult: Constants.BizResult.Fail,
         });
      }
   });
};

/** Function uses for adding entries when repeat type = 4 (Yearly) */
const addEntryRepeatYear = (params, res, connection) => {
   const queryRepeat =
      'INSERT INTO mrbs_repeat (start_time, end_time, rep_type, end_date, rep_opt, room_id, create_by, modified_by, name, type, description, rep_interval, status, ical_uid, ical_sequence, month_absolute, month_relative) VALUES ?';
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
   connection.query(queryRepeat, [repeatArray], (error, rows) => {
      connection.release();
      if (!error) {
         const repeatYear = Number(params.rep_interval || 0);
         const repeatId = Number(rows.insertId);
         const recordAdded = rows.affectedRows;
         const periodTime =
            Utils.getUnixTime(params.end_time) -
            Utils.getUnixTime(params.start_time);
         const queryEntry =
            'INSERT INTO mrbs_entry (start_time, end_time, entry_type, repeat_id, room_id, create_by, modified_by, name, type, description, status) VALUES ?';
         let hasError = false;

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
                                   Constants.AddDateTypes.Year
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
               connection.query(queryEntry, [paramArray], (err2, rows2) => {
                  if (err2) {
                     hasError = true;
                  }
               });
            });

         if (!hasError) {
            return res.json({
               message: 'Add entry successfully!',
               bizResult: Constants.BizResult.Success,
            });
         }

         return res.json({
            errors: error,
            bizResult: Constants.BizResult.Fail,
         });
      } else {
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
               (err, rows) => {
                  connection.release();
                  if (err) {
                     hasError = true;
                     errorArray.push(err);
                  }
               }
            );
         });

         if (hasError) {
            return res.json({
               errors: errorArray,
               bizResult: Constants.BizResult.Fail,
            });
         } else {
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
      const { id } = req.body;
      dbConnect.getConnection((err, connection) => {
         if (err) throw err;

         const query = 'DELETE FROM mrbs_entry WHERE id = ?';
         connection.query(query, [id], (error, rows) => {
            connection.release();
            if (!err) {
               res.json({
                  message: 'Delete entry successfully!',
                  bizResult: Constants.BizResult.Success,
               });
            } else {
               res.json({
                  errors: error,
                  bizResult: Constants.BizResult.Fail,
               });
            }
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
