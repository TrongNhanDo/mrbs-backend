import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    room_name: {
      type: String,
      require: true
    },
    sort_key: {
      type: String,
      require: false
    },
    area_id: {
      type: Number,
      require: false
    },
    description: {
      type: String,
      require: false
    },
    capacity: {
      type: Number,
      require: true
    },
    room_admin_email: {
      type: String,
      require: true
    }
  },
  {
    timestamps: true
  }
);

const roomModel = mongoose.model('room', roomSchema);

export default roomModel;
