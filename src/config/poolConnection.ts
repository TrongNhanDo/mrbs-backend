import mysql from 'mysql';

const dbConnect = mysql.createPool({
  connectionLimit: 100,
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'mrbs',
});

export default dbConnect;
