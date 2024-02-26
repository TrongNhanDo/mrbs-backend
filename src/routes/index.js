const calendarRoute = require('./calendarRoute');

const route = (app) => {
    app.get('/', async (req, res) => {
        return res.send('Hello world');
    });

    app.use('/api/events/', calendarRoute);
};

module.exports = route;
