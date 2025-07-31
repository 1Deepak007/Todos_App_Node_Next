const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Task = require('./Task');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter your name'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true,
    lowercase: true,
    match: [/.+\@.+\..+/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  profilePicture: {
    type: String
    // ,default: 'https://res.cloudinary.com/dqbddypvk/image/upload/v1753532803/TODOS_APP_NODE_NEXT/igzjku9msek2ep4syfih.png'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};


// Delete tasks when a user is deleted
userSchema.pre('remove', async function(next) {
  console.log(`Tasks related to user ${this._id} are being removed.`);
  await Task.deleteMany({ user: this._id });
  next();
});

module.exports = mongoose.model('User', userSchema);