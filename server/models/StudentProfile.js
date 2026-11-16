const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema(
  {
    day: {
      type: String,
      required: true,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    slots: {
      type: [String],
      default: []
    }
  },
  { _id: false }
);

const studentProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true
    },
    avatar: {
      type: String,
      default: ''
    },
    bio: {
      type: String,
      default: '',
      maxlength: [600, 'Bio cannot exceed 600 characters']
    },
    subjects: {
      type: [String],
      default: []
    },
    favoriteSubjects: {
      type: [String],
      default: []
    },
    skills: {
      type: [String],
      default: []
    },
    interests: {
      type: [String],
      default: []
    },
    studyGoals: {
      type: [String],
      default: []
    },
    preferredStudyMode: {
      type: String,
      enum: ['Online', 'Offline', 'Both', 'In-Person', 'Hybrid'],
      default: 'Both'
    },
    preferredGroupSize: {
      type: String,
      enum: ['One-to-one', 'Small group', 'Any'],
      default: 'Small group'
    },
    studyStyles: {
      type: [String],
      default: ['Problem-solving', 'Practical learning']
    },
    availability: {
      type: [availabilitySchema],
      default: [
        { day: 'Monday', slots: ['Evening: 5 PM – 10 PM'] },
        { day: 'Wednesday', slots: ['Evening: 5 PM – 10 PM'] },
        { day: 'Saturday', slots: ['Morning: 6 AM – 12 PM', 'Afternoon: 12 PM – 5 PM'] }
      ]
    },
    contactEmail: {
      type: String,
      default: ''
    },
    phone: {
      type: String,
      default: ''
    },
    github: {
      type: String,
      default: ''
    },
    linkedin: {
      type: String,
      default: ''
    },
    location: {
      type: String,
      default: 'Main Campus Library'
    },
    profileCompletion: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for userId alias
studentProfileSchema.virtual('userId')
  .get(function () {
    return this.user;
  })
  .set(function (v) {
    this.user = v;
  });

// Mathematical calculation of profile completion percentage & suggestions
studentProfileSchema.methods.calculateCompletion = function (user = null) {
  let score = 0;
  const suggestions = [];

  // 1. Basic Academic Details (FullName, College, Department, YearOfStudy) (15 pts)
  const hasUserBasics = user
    ? user.fullName && user.college && user.department && user.yearOfStudy
    : true;
  if (hasUserBasics) {
    score += 15;
  } else {
    suggestions.push('Complete your basic academic details (Major, College, Year of study).');
  }

  // 2. Bio / Self introduction (10 pts)
  if (this.bio && this.bio.trim().length >= 15) {
    score += 10;
  } else {
    suggestions.push('Add a study bio explaining what you are looking for in a partner.');
  }

  // 3. Current Subjects (20 pts)
  if (this.subjects && this.subjects.length > 0) {
    score += 20;
  } else {
    suggestions.push('Add at least one enrolled subject or course.');
  }

  // 4. Technical / Lab Skills (15 pts)
  if (this.skills && this.skills.length > 0) {
    score += 15;
  } else {
    suggestions.push('Add your technical or laboratory skills.');
  }

  // 5. Academic Interests (10 pts)
  if (this.interests && this.interests.length > 0) {
    score += 10;
  } else {
    suggestions.push('Add your academic and research interests.');
  }

  // 6. Study Goals (10 pts)
  if (this.studyGoals && this.studyGoals.length > 0) {
    score += 10;
  } else {
    suggestions.push('Select your study goals (e.g. Exam Prep, Lab Projects).');
  }

  // 7. Weekly Availability Schedule (10 pts)
  const hasAvailability =
    this.availability &&
    this.availability.some((a) => a.slots && a.slots.length > 0);
  if (hasAvailability) {
    score += 10;
  } else {
    suggestions.push('Select your weekly available days and time slots.');
  }

  // 8. Study Preferences & Contacts (10 pts)
  if (this.preferredStudyMode && this.preferredGroupSize && this.studyStyles && this.studyStyles.length > 0) {
    score += 10;
  } else {
    suggestions.push('Specify your preferred study mode and group size.');
  }

  const finalScore = Math.min(100, score);
  this.profileCompletion = finalScore;

  return {
    completionPercentage: finalScore,
    suggestions
  };
};

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
