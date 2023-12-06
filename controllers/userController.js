const dbConnect = require('../config/poolConnection');

const getAllUsers = (req, res) => {
   try {
      dbConnect.getConnection((err, connection) => {
         if (err) throw err;

         connection.query('SELECT * from mrbs_users', (err, rows) => {
            connection.release();
            if (!err) {
               return res.json({
                  data: rows || [],
                  bizResult: '0',
               });
            } else {
               return res.json({
                  errors: err,
                  bizResult: '8',
               });
            }
         });
      });
   } catch (error) {
      throw error;
   }
};

const addUser = (req, res) => {
   try {
      dbConnect.getConnection((err, connection) => {
         if (err) throw err;

         const { level, name, display_name, password_hash, email, last_login } =
            req.body;
         const query =
            'INSERT INTO mrbs_users (level, name, display_name, password_hash, email, last_login) VALUES (?,?,?,?,?,?)';
         connection.query(
            query,
            [level, name, display_name, password_hash, email, last_login],
            (err, rows) => {
               connection.release();
               if (!err) {
                  return res.json({
                     message: 'Add successfully!',
                     insertId: rows.insertId || undefined,
                     bizResult: '0',
                  });
               } else {
                  return res.json({
                     message: err.message || undefined,
                     bizResult: '8',
                  });
               }
            }
         );
      });
   } catch (error) {
      throw error;
   }
};

const updateUser = (req, res) => {
   try {
      dbConnect.getConnection((err, connection) => {
         if (err) throw err;

         const { id, level, display_name, password_hash, email } = req.body;
         const query =
            'UPDATE mrbs_users SET level = ?, display_name = ?, password_hash = ?, email = ? WHERE id = ?';
         connection.query(
            query,
            [level, display_name, password_hash, email, id],
            (err, rows) => {
               connection.release();

               if (!err) {
                  return res.json({
                     message: `Update successfully!`,
                     bizResult: '0',
                  });
               } else {
                  return res.json({
                     bizResult: '8',
                     errors: err,
                  });
               }
            }
         );
      });
   } catch (error) {
      throw error;
   }
};

const deleteUser = (req, res) => {
   try {
      const { id } = req.body;
      dbConnect.getConnection((err, connection) => {
         if (err) throw err;

         const query = 'DELETE FROM mrbs_users WHERE id = ?';
         connection.query(query, [id], (err, rows) => {
            connection.release();
            if (!err) {
               res.json({
                  message: 'Delete successfully!',
                  bizResult: '0',
               });
            } else {
               res.json({
                  bizResult: '8',
                  errors: err,
               });
            }
         });
      });
   } catch (error) {
      throw error;
   }
};

module.exports = {
   getAllUsers,
   addUser,
   updateUser,
   deleteUser,
};
