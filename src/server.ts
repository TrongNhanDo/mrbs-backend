import express from 'express';
import mongoose from 'mongoose';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import 'dotenv/config';
import * as CommonConstants from './common/constants';
import userRoute from './routes/userRoute';
import roomRoute from './routes/roomRoute';
import participantRoute from './routes/participantRoute';
import entryRoute from './routes/entryRoute';
import mongodbConnection from './config/mongodbConnection';

const app = express();
app.use(cors({ credentials: true }));
app.use(bodyParser.json());

const server = http.createServer(app);

const isMongodb = process.env.DB_MODE === CommonConstants.DbTypes.MongoDB;

if (isMongodb) {
  /** connect to MongoDB database */
  mongodbConnection();
}

const port = process.env.PORT;

app.get('/', (req: express.Request, res: express.Response) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// route for user table
app.use('/api/users', userRoute);

// route for room table
app.use('/api/rooms', roomRoute);

// route for participant table
app.use('/api/participants', participantRoute);

// route for entry table
app.use('/api/entries', entryRoute);

if (isMongodb) {
  mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB Database');
    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  });

  mongoose.connection.on('error', (err) => {
    console.log({ errorConnectMongoDB: err });
  });
} else {
  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
