import mongoose from 'mongoose';

const repeatSchema = new mongoose.Schema(
  {
    start_time: {
      type: String,
      require: false
    },
    end_time: {
      type: String,
      require: false
    },
    rep_type: {
      type: String,
      require: false
    },
    end_date: {
      type: String,
      require: false
    },
    rep_opt: {
      type: String,
      require: false
    },
    room_id: {
      type: String,
      require: false
    },
    create_by: {
      type: String,
      require: false
    },
    modified_by: {
      type: String,
      require: false
    },
    name: {
      type: String,
      require: false
    },
    type: {
      type: String,
      require: false
    },
    description: {
      type: String,
      require: false
    },
    rep_interval: {
      type: String,
      require: false
    },
    status: {
      type: String,
      require: false
    },
    ical_uid: {
      type: String,
      require: false
    },
    ical_sequence: {
      type: String,
      require: false
    },
    month_absolute: {
      type: String,
      require: false
    },
    month_relative: {
      type: String,
      require: false
    }
  },
  {
    timestamps: true
  }
);

const repeatModel = mongoose.model('repeat', repeatSchema);

export default repeatModel;
