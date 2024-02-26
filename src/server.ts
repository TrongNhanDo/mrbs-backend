import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import 'dotenv/config';
import userRoute from './routes/userRoute';
import roomRoute from './routes/roomRoute';
import participantRoute from './routes/participantRoute';
import entryRoute from './routes/entryRoute';

const app = express();
app.use(cors({ credentials: true }));
app.use(bodyParser.json());

const server = http.createServer(app);

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

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
