const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema(
  {
    accessToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('token', tokenSchema);
