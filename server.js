const express = require('express');
const http = require('node:http');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const userRoute = require('./routes/userRoute');
const roomRoute = require('./routes/roomRoute');
const participantRoute = require('./routes/participantRoute');

const app = express(cors);

app.use(bodyParser.json());

const server = http.createServer(app);

const port = process.env.PORT;

app.get('/', (req, res) => {
   res.send('Welcome to my nodejs project!');
});

// route for user table
app.use('/api/users/', userRoute);

// route for room table
app.use('/api/rooms/', roomRoute);

// route for participant table
app.use('/api/participants', participantRoute);

server.listen(port, () => {
   console.log(`Server is running on port ${port}`);
});
