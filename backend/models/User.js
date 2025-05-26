const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required.'],
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Password is required.'],
    minlength: [6, 'Password must be at least 6 characters.']
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'technician', 'client'], // Update according to the roles in your application
    default: 'user'
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Hashing the password before saving (pre-save hook)
UserSchema.pre('save', async function(next) {
  // Hash only if the password field is modified or it's a new user
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare entered password with the hashed password in the database
UserSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema); 