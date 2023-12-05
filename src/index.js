// import express from 'express';
// import { createServer } from 'node:http';
// import cors from 'cors';
// import bodyParser from 'body-parser';
// import 'dotenv/config';
// import db from '../config/poolConnection';

// const app = express(cors);
// app.use(bodyParser.json());
// const server = createServer(app);

// const port = process.env.PORT || 3000;

// app.get('', (req, res) => {
//    db.getConnection((err, connection) => {
//       if (err) {
//          console.log(err);
//          throw err;
//       }

//       connection.query('SELECT * from mrbs_users', (err, rows) => {
//          connection.release(); // return the connection to pool

//          console.log({ err, rows });

//          if (!err) {
//             res.send(rows);
//          } else {
//             console.log(err);
//          }
//       });
//    });
// });

// server.listen(port, () => {
//    console.log(`Server is running on port ${port}`);
// });

const express = require('express');
const http = require('node:http');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const userRoute = require('../routes/userRoute');

const app = express(cors);
app.use(bodyParser.json());
const server = http.createServer(app);

const port = process.env.PORT;

app.get('/', (req, res) => {
   res.send('Welcome to my nodejs project!');
});

app.use('/api/users/', userRoute);

server.listen(port, () => {
   console.log(`Server is running on port ${port}`);
});
