const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    '@odata.etag': { type: String },
    eventId: { type: String },
    createdDateTime: { type: String },
    lastModifiedDateTime: { type: String },
    changeKey: { type: String },
    categories: {
      type: [String],
    },
    transactionId: { type: String },
    originalStartTimeZone: { type: String },
    originalEndTimeZone: { type: String },
    iCalUId: { type: String },
    reminderMinutesBeforeStart: {
      type: Number,
    },
    isReminderOn: {
      type: Boolean,
    },
    hasAttachments: {
      type: Boolean,
    },
    subject: { type: String },
    bodyPreview: { type: String },
    importance: { type: String },
    sensitivity: { type: String },
    isAllDay: {
      type: Boolean,
    },
    isCancelled: {
      type: Boolean,
    },
    isOrganizer: {
      type: Boolean,
    },
    responseRequested: {
      type: Boolean,
    },
    seriesMasterId: { type: String },
    showAs: { type: String },
    type: { type: String },
    webLink: { type: String },
    onlineMeetingUrl: { type: String },
    isOnlineMeeting: {
      type: Boolean,
    },
    onlineMeetingProvider: { type: String },
    allowNewTimeProposals: {
      type: Boolean,
    },
    occurrenceId: { type: String },
    isDraft: {
      type: Boolean,
    },
    hideAttendees: {
      type: Boolean,
    },
    responseStatus: {
      response: { type: String },
      time: { type: String },
    },
    body: {
      contentType: { type: String },
      content: { type: String },
    },
    start: {
      dateTime: { type: String },
      timeZone: { type: String },
    },
    end: {
      dateTime: { type: String },
      timeZone: { type: String },
    },
    location: {
      displayName: { type: String },
      locationType: { type: String },
      uniqueId: { type: String },
      uniqueIdType: { type: String },
    },
    locations: [
      {
        displayName: { type: String },
        locationType: { type: String },
        uniqueId: { type: String },
        uniqueIdType: { type: String },
        address: {
          street: { type: String },
          city: { type: String },
          state: { type: String },
          countryOrRegion: { type: String },
          postalCode: { type: String },
        },
        coordinates: {
          latitude: { type: String },
          longitude: { type: String },
        },
      },
    ],
    recurrence: { type: String },
    attendees: [
      {
        type: { type: String },
        status: {
          response: { type: String },
          time: { type: String },
        },
        emailAddress: {
          name: { type: String },
          address: { type: String },
        },
      },
    ],
    organizer: {
      emailAddress: {
        name: { type: String },
        address: { type: String },
      },
    },
    onlineMeeting: { type: String },
    calendarAssociationLink: { type: String },
    calendarNavigationLink: { type: String },
  },
  {
    timestamps: true,
    collection: 'events',
  }
);

module.exports = mongoose.model('event', eventSchema);
