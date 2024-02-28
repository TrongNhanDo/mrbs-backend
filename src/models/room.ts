import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    room_name: {
      type: String,
      require: true
    },
    sort_key: {
      type: String,
      require: true
    },
    description: {
      type: String,
      require: true
    },
    capacity: {
      type: Number,
      require: true
    },
    room_admin_email: {
      type: String,
      require: true
    },
    disabled: {
      type: Number,
      require: false,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

const roomModel = mongoose.model('room', roomSchema);

export default roomModel;
