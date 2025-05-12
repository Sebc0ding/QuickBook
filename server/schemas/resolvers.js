const { User, Appointment, Professional } = require('../models');
const { signToken } = require('../utils/auth');
const { AuthenticationError } = require('apollo-server-express');
const { sendSms } = require('../utils/twilio');
const { processWithOpenAI } = require('../utils/openai');
const {
  addToGoogleCalendar,
  updateGoogleCalendarEvent,
  deleteGoogleCalendarEvent
} = require('../utils/googleCalendar');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select('-__v -password')
          .populate('appointments');
        return userData;
      }
      throw new AuthenticationError('Not logged in');
    },
    appointments: async (parent, args, context) => {
      if (context.user) {
        return Appointment.find({ userId: context.user._id }).sort({ createdAt: -1 });
      }
      throw new AuthenticationError('Not logged in');
    },
    appointment: async (parent, { _id }, context) => {
      if (context.user) {
        return Appointment.findOne({ _id, userId: context.user._id });
      }
      throw new AuthenticationError('Not logged in');
    },
    getProfessionalProfile: async (parent, args, context) => {
      if (context.user) {
        const professional = await Professional.findOne({ user: context.user._id });
        return professional;
      }
      throw new AuthenticationError('Not logged in');
    },
    
    getProfessionalServices: async (parent, args, context) => {
      if (context.user) {
        const professional = await Professional.findOne({ user: context.user._id });
        return professional?.services || [];
      }
      throw new AuthenticationError('Not logged in');
    },
    
    getProfessionalAvailability: async (parent, args, context) => {
      if (context.user) {
        const professional = await Professional.findOne({ user: context.user._id });
        return professional?.availability || [];
      }
      throw new AuthenticationError('Not logged in');
    }
  },
  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }
      const token = signToken(user);
      return { token, user };
    },
    addAppointment: async (parent, args, context) => {
      if (context.user) {
        // Create appointment in our database
        const appointment = await Appointment.create({
          ...args,
          userId: context.user._id,
        });
        // Add to Google Calendar
        const googleEvent = await addToGoogleCalendar({
          summary: args.title,
          description: args.description,
          startTime: args.startTime,
          endTime: args.endTime,
          userEmail: context.user.email,
        });
        // Update the appointment with Google Event ID
        if (googleEvent && googleEvent.id) {
          appointment.googleEventId = googleEvent.id;
          await appointment.save();
        }
        // Add appointment to user
        await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { appointments: appointment._id } },
          { new: true }
        );
        // Send confirmation SMS
        await sendSms(
          context.user.phoneNumber,
          `Your appointment "${args.title}" has been scheduled for ${new Date(args.startTime).toLocaleString()}.`
        );
        return appointment;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    updateAppointment: async (parent, args, context) => {
      if (context.user) {
        const appointment = await Appointment.findOneAndUpdate(
          { _id: args._id, userId: context.user._id },
          args,
          { new: true }
        );
        // Update Google Calendar event if exists
        if (appointment.googleEventId) {
          await updateGoogleCalendarEvent({
            eventId: appointment.googleEventId,
            summary: args.title,
            description: args.description,
            startTime: args.startTime,
            endTime: args.endTime,
          });
        }
        return appointment;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    removeAppointment: async (parent, { _id }, context) => {
      if (context.user) {
        const appointment = await Appointment.findOneAndDelete({
          _id,
          userId: context.user._id,
        });
        // Remove from Google Calendar
        if (appointment.googleEventId) {
          await deleteGoogleCalendarEvent(appointment.googleEventId);
        }
        await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $pull: { appointments: _id } }
        );
        return appointment;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    processAiMessage: async (parent, { message }, context) => {
      if (context.user) {
        // Process the message with OpenAI
        const response = await processWithOpenAI(message, context.user);
        return response;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    createProfessional: async (parent, args, context) => {
      if (context.user) {
        const professional = await Professional.create({
          ...args,
          user: context.user._id
        });
        
        return professional;
      }
      throw new AuthenticationError('Not logged in');
    },
    
    addService: async (parent, { name, duration, price, description }, context) => {
      if (context.user) {
        const professional = await Professional.findOne({ user: context.user._id });
        
        if (!professional) {
          throw new Error('Professional profile not found');
        }
        
        professional.services.push({ name, duration, price, description });
        await professional.save();
        
        return professional.services[professional.services.length - 1];
      }
      throw new AuthenticationError('Not logged in');
    },
    
    addAvailability: async (parent, { day, startTime, endTime }, context) => {
      if (context.user) {
        const professional = await Professional.findOne({ user: context.user._id });
        
        if (!professional) {
          throw new Error('Professional profile not found');
        }
        
        professional.availability.push({ day, startTime, endTime });
        await professional.save();
        
        return professional.availability[professional.availability.length - 1];
      }
      throw new AuthenticationError('Not logged in');
    },
    
    connectGoogleCalendar: async (parent, { code, redirectUri }, context) => {
      if (context.user) {
        try {
          const professional = await Professional.findOneAndUpdate(
            { user: context.user._id },
            { calendarId: 'primary' },
            { new: true }
          );
          
          return {
            success: true,
            message: "Google Calendar connected successfully",
            calendarId: "primary"
          };
        } catch (error) {
          console.error('Error connecting Google Calendar:', error);
          throw new Error('Failed to connect Google Calendar');
        }
      }
      throw new AuthenticationError('Not logged in');
    },
    
    // Add alias for createProfessionalProfile
    createProfessionalProfile: async (parent, args, context) => {
      // Just call the existing function
      return resolvers.Mutation.createProfessional(parent, args, context);
    }
  },
};

module.exports = resolvers;

module.exports = resolvers;
