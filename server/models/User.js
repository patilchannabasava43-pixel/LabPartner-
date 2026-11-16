const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true,
      maxlength: [60, 'Full name cannot exceed 60 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid campus email address'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false
    },
    college: {
      type: String,
      required: [true, 'Please provide your college/university name'],
      trim: true
    },
    department: {
      type: String,
      required: [true, 'Please provide your department/major'],
      trim: true
    },
    yearOfStudy: {
      type: String,
      required: [true, 'Please provide your year of study'],
      enum: {
        values: ['First Year', 'Second Year', 'Third Year', 'Fourth Year', 'Other', '1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduate / Masters', 'PhD'],
        message: '{VALUE} is not a valid year of study'
      },
      default: 'First Year'
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student'
    },
    avatar: {
      type: String,
      default: ''
    },
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StudentProfile'
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtuals for backwards and seamless compatibility
userSchema.virtual('name')
  .get(function () {
    return this.fullName;
  })
  .set(function (v) {
    this.fullName = v;
  });

userSchema.virtual('year')
  .get(function () {
    return this.yearOfStudy;
  })
  .set(function (v) {
    this.yearOfStudy = v;
  });

// Pre-validate hook to handle legacy 'name' or 'year' passed in payload
userSchema.pre('validate', function (next) {
  if (!this.fullName && this.get('name')) {
    this.fullName = this.get('name');
  }
  if (!this.yearOfStudy && this.get('year')) {
    this.yearOfStudy = this.get('year');
  }
  next();
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare candidate password with hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Omit password hash from serialized output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
