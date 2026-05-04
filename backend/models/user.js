import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    match: /^[0-9]{10}$/
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    enum: ['user'],
    default: 'user'
  },
  numericId: {
    type: Number,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  image: {
    type: String,
    required: false
  },
  gender: {
    type: String,
    required: true,
    enum: ['male', 'female', 'other'],
    default: 'male'
  },
  otp: { type: String },
  otpExpires: { type: Date },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

userSchema.pre('save', async function (next) {
  if (!this.numericId) {
    const lastUser = await mongoose.model('User').findOne().sort({ numericId: -1 });
    this.numericId = lastUser ? lastUser.numericId + 1 : 1;
  }

  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  next();
});

userSchema.virtual('publicProfile').get(function () {
  return {
    numericId: this.numericId,
    name: this.name,
    email: this.email,
    phone: this.phone,
    username: this.username,
    role: this.role,
    image: this.image,
    gender: this.gender,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
});

// Query indexes

export default mongoose.model('User', userSchema);
