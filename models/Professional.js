const { Schema, model } = require('mongoose');

const professionalSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Must match an email address!']
    },
    phoneNumber: {
      type: String,
      required: true
    },
    specialty: {
      type: String,
      required: true
    },
    bio: {
      type: String
    },
    availability: [{
      day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        required: true
      },
      startTime: {
        type: String,
        required: true
      },
      endTime: {
        type: String,
        required: true
      }
    }],
    services: [{
      name: {
        type: String,
        required: true
      },
      duration: {
        type: Number,  // Duration in minutes
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      description: {
        type: String
      }
    }],
    calendarId: {
      type: String  // For Google Calendar integration
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    toJSON: {
      virtuals: true
    },
    id: false
  }
);

// Virtual to get upcoming appointments
professionalSchema.virtual('appointments', {
  ref: 'Appointment',
  localField: '_id',
  foreignField: 'professional'
});

const Professional = model('Professional', professionalSchema);

module.exports = Professional;
