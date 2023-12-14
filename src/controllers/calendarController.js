const EventModel = require('../models/Event');
const { format } = require('date-fns');

const listenCalendarEvent = (req, res) => {
  const token =
    'eyJ0eXAiOiJKV1QiLCJub25jZSI6IjZTUUc1RURzZ1JycmNQdFdNbmRVV2kzV0Z6aG4zUDZ2ZkRBLTBpbEhwZFEiLCJhbGciOiJSUzI1NiIsIng1dCI6IlQxU3QtZExUdnlXUmd4Ql82NzZ1OGtyWFMtSSIsImtpZCI6IlQxU3QtZExUdnlXUmd4Ql82NzZ1OGtyWFMtSSJ9.eyJhdWQiOiJodHRwczovL2dyYXBoLm1pY3Jvc29mdC5jb20iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9mOGNkZWYzMS1hMzFlLTRiNGEtOTNlNC01ZjU3MWU5MTI1NWEvIiwiaWF0IjoxNzAyNTI2MDU4LCJuYmYiOjE3MDI1MjYwNTgsImV4cCI6MTcwMjYxMjc1OCwiYWlvIjoiRTJWZ1lIanN1c3JvaUhqWVh3a2x4Z1l1aVNRSEFBPT0iLCJhcHBfZGlzcGxheW5hbWUiOiJTT0NLRVQiLCJhcHBpZCI6IjNmN2EyOGY5LWQ5YjgtNGU2MC04MzcxLWQ3YjhjOTcwZDNhOCIsImFwcGlkYWNyIjoiMSIsImlkcCI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0L2Y4Y2RlZjMxLWEzMWUtNGI0YS05M2U0LTVmNTcxZTkxMjU1YS8iLCJpZHR5cCI6ImFwcCIsInJoIjoiMC5BUm9BTWVfTi1CNmpTa3VUNUY5WEhwRWxXZ01BQUFBQUFBQUF3QUFBQUFBQUFBQUJBQUEuIiwidGVuYW50X3JlZ2lvbl9zY29wZSI6IldXIiwidGlkIjoiZjhjZGVmMzEtYTMxZS00YjRhLTkzZTQtNWY1NzFlOTEyNTVhIiwidXRpIjoiZ3hvZWt6UlZTRUtHTmNaWGk1dXVBQSIsInZlciI6IjEuMCIsIndpZHMiOlsiMDk5N2ExZDAtMGQxZC00YWNiLWI0MDgtZDVjYTczMTIxZTkwIl0sInhtc190Y2R0IjoxMzM4MzM2Njg1fQ.hw_E6rE-vRo8hXRqwKOPG9Aum1vSDQDFqVB2rWtDHfz1WxZSxYnWRmuv6OJgzohkKByrHxG8vcnoTMvlv5muJIgTuuSZXjJtAGrwiZLUD42r-vvBayjMrn88X4GpHDGfvc1DiGzzNdAiWz_M_UCTyhHKiw2FS_IRPKjruJqnmv32Js7gFNMqfyj92eyy3Ti9aLSmvo8UbBiOlJ1pSG-0slYPpAnjJfkRbr3siquPL6A2Pnj1inEzxvam7TO_-1km5ACnlh1_KDMHuwm8S6thpvFmxHIW1ViGGjkVesaiQ5WklGs1P0SFnGypGBo64tF38Ze1mSiOlBOJVnhvd5BAag';
  res.set('Content-Type', 'text/plain');
  res.send(req.query.validationToken || token);
  return;
};

const getAllEvents = async (req, res) => {
  try {
    const listEvent = await EventModel.find().lean().exec();
    return res.json({
      returnCnt: listEvent ? listEvent.length : 0,
      events: listEvent || [],
    });
  } catch (error) {
    throw error;
  }
};

const addEvent = async (req, res) => {
  try {
    const params = req.body;
    const listEvent = await EventModel.insertMany(params.listEvent);
    return res.json({
      eventCreated: listEvent,
    });
  } catch (error) {
    throw error;
  }
};

const getEventByCondition = async (req, res) => {
  try {
    const params = req.body;
    const events = await EventModel.find({
      'start.timeZone': 'ASD',
    })
      .lean()
      .exec();

    return res.json({
      returnCnt: events.length || 0,
      events: events || [],
    });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  listenCalendarEvent,
  getAllEvents,
  addEvent,
  getEventByCondition,
};
