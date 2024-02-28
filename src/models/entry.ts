import mongoose from 'mongoose';

const entrySchema = new mongoose.Schema(
  {
    start_time: {
      type: String,
      require: false
    },
    end_time: {
      type: String,
      require: false
    },
    entry_type: {
      type: String,
      require: false
    },
    repeat_id: {
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
    status: {
      type: String,
      require: false
    }
  },
  {
    timestamps: true
  }
);

const entryModel = mongoose.model('entry', entrySchema);

export default entryModel;
