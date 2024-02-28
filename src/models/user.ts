import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    level: {
      type: Number,
      require: true
    },
    name: {
      type: String,
      require: true
    },
    display_name: {
      type: String,
      require: true
    },
    password_hash: {
      type: String,
      require: true
    },
    email: {
      type: String,
      require: true
    },
    last_login: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

const userModel = mongoose.model('user', userSchema);

export default userModel;
