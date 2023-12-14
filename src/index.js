const express = require('express');
const http = require('node:http');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const calendarRoute = require('./routes/calendarRoute');
const connectDB = require('./config/dbConn');
const mongoose = require('mongoose');

connectDB();
const app = express(cors);
app.use(bodyParser.json());
const server = http.createServer(app);
const port = process.env.PORT || 3456;

// const axios = require('axios');
// const auth = require('./helpers/auth');
// const fetch = require('./helpers/fetch');
app.get('/', async (req, res) => {
  // const urlSubscription = 'https://graph.microsoft.com/v1.0/subscriptions';
  // const authResponse = await auth.getToken(auth.tokenRequest);
  // const accessTokenOnline =
  //   'EwCAA8l6BAAUAOyDv0l6PcCVu89kmzvqZmkWABkAAYqhp57SkJ+87qQhlN5u55Wycx7QwajJaTmCWrtvqRWTTAcnWXJZ2tcgUcc9+MvauuvN4opgeUzX+1ealaX0fefNohxNLAwptK7+n9X9a2I07CdXfrA9eCVF3lNivxFYCNZV/ETSihuSSkBYkMpDFHs7lPQ25qI8mtuFVuVzVSB8fvgodHzsoWMR/ESntUrxERYO4z0Cp6VyWedAX9R3vXgeaHU+S8RrGgfsP32zimxIwn/zng6vxH1URQiGanJMmK6/I05lNgi6L3lMtYi3+LFIysfZOVU8XJPtauxNSkPud1+E8ORWAxwRaC3CwRrp0nWwO6NXhi3fUz6Ae4M0wgkDZgAACII956ptGa0dUAJhg7ZkHVyKz92RmJwWAyqN47m/93zBDulQq+lGbtwOgin9K221p7lS/w3n6QlOgfigsuWEscPATcdXMjYuV57KxpaE6tyCaFdm5VDGryyruvgGu56KyYqpdUQdFYF98v6tVjBL+JeXcmF/xJH0ruyrfSEj/tETw5HQZN40WqME7IiOKcTFXzNBc0FKGmFA/bAZ1yuy+dj5WkhGNt/BsFt/F96X9B2hYorGU2L5jM4sXswNBcA5Rdqk1+yFYbL0OTWaE9aPcj8jd4Ynzn67XY1S6JIHhWB2YTUYInI9F1h3/yNN7kx/GcxK5+FZ4lpcsmXUTLziIRjDBYLld8JU5TUbItlEMJ1owCjQWwiPm4xFNLrAhM+neoAo1B9fdEGJWEiHLZXT1NxHge2Z5HKnN3pvjNjCghavZH5vXqXwQajYOHMgNbgDfRyvEK8ULzWJOIzwxfQTTdIq6BP38zI0uwN1mtzQpvuUIFLddl3AA735VdUnmJE38sv5ShuMNi3XC+7xn17ajor7fYAfNqz1zKuPoLlayxgSepxmFRojMf/DChEXbzv/QvBcHBUiT8exQpAQfvYzMICYcQO60VCtbxJWj04dPxMfMPBToawzHUbEygtxboZKuWOmdliZ+ZpDR/fBYgVAQU6V3ql/uAaJr2So8qYnubMS4WuakYMkBQeHG+SwaIOob4wb+wZfanlbI2Rku6trfj/m5ZVgK7RXRHaI3pDAiSLgfqisEol4xeRjAjE7eypMrZaFxDtrrNY1b6OnXzLUGTYYWUL+OW/wM3L6nAI=';

  // const users = await fetch.callApi(auth.apiConfig.uri, accessTokenOnline);

  return res.json({});

  // const subscription = await axios({
  //   method: 'post',
  //   url: urlSubscription,
  //   headers: {
  //     Authorization: `Bearer ${authResponse.accessToken}`,
  //   },
  //   data: {
  //     changeType: 'created,updated,deleted',
  //     notificationUrl: 'https://dtnhan.cyclic.app/api/calendar/',
  //     resource: '/me/events',
  //     expirationDateTime: '2023-12-14T04:30:00.000Z',
  //     clientState: 'secretClientValue',
  //     latestSupportedTlsVersion: 'v1_2',
  //   },
  // });
  // console.log({ subscription });
});

app.use('/api/events/', calendarRoute);

mongoose.connection.once('open', () => {
  console.log('Connected to mongoDB');
  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});

mongoose.connection.on('error', (err) => {
  console.log({ errorMongoose: err });
});
