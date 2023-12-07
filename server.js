const express = require('express');
const http = require('node:http');
const path = require('node:path');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const userRoute = require('./routes/userRoute');
const roomRoute = require('./routes/roomRoute');
const participantRoute = require('./routes/participantRoute');
const entryRoute = require('./routes/entryRoute');

const app = express(cors);

app.use(bodyParser.json());

const server = http.createServer(app);

const port = process.env.PORT;

app.get('/', (req, res) => {
   res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// route for user table
app.use('/api/users/', userRoute);

// route for room table
app.use('/api/rooms/', roomRoute);

// route for participant table
app.use('/api/participants/', participantRoute);

// route for entry table
app.use('/api/entries/', entryRoute);

server.listen(port, () => {
   console.log(`Server is running on port ${port}`);
});
