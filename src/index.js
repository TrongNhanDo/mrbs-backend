const express = require('express');
const http = require('node:http');
const path = require('node:path');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const axios = require('axios');
const userRoute = require('./routes/userRoute');
const roomRoute = require('./routes/roomRoute');
const participantRoute = require('./routes/participantRoute');
const entryRoute = require('./routes/entryRoute');
const calendarRoute = require('./routes/calendarRoute');
const auth = require('./helpers/auth');
const fetch = require('./helpers/fetch');

const app = express(cors);

app.use(bodyParser.json());

const server = http.createServer(app);

const port = process.env.PORT;

app.get('/', async (req, res) => {
  const urlSubscription = 'https://graph.microsoft.com/v1.0/subscriptions';

  const authResponse = await auth.getToken(auth.tokenRequest);

  console.log({ accessToken: authResponse.accessToken });

  // const users = await fetch.callApi(
  //   auth.apiConfig.uri,
  //   authResponse.accessToken
  // );
  // console.log({ users });

  const subscription = await axios({
    method: 'post',
    url: urlSubscription,
    headers: {
      Authorization: `Bearer ${authResponse.accessToken}`,
    },
    data: {
      changeType: 'created,updated,deleted',
      notificationUrl: 'https://dtnhan.cyclic.app/api/calendar/',
      resource: '/me/events',
      expirationDateTime: '2023-12-14T03:30:00.000Z',
      clientState: 'secretClientValue',
      latestSupportedTlsVersion: 'v1_2',
    },
  });
  console.log({ subscription });

  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// route for calendar
app.use('/api/calendar/', calendarRoute);

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
