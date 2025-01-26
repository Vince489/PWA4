const mongoose = require('mongoose');

// Define the schema
const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024,
  },
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }
  ],
  likes: {
    type: Number,
    default: 0, // Starts at 0
  },
}, {
  timestamps: true,
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
