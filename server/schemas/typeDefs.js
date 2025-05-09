const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    phoneNumber: String
    appointments: [Appointment]
  }

  type Professional {
    _id: ID
    name: String
    email: String
    phoneNumber: String
    specialty: String
    bio: String
    availability: [Availability]
    services: [Service]
    calendarId: String
    user: ID
  }

  type Availability {
    day: String
    startTime: String
    endTime: String
  }

  type Service {
    _id: ID
    name: String
    duration: Int
    price: Float
    description: String
  }

  input AvailabilityInput {
    day: String!
    startTime: String!
    endTime: String!
  }

  input ServiceInput {
    name: String!
    duration: Int!
    price: Float!
    description: String
  }

  type Appointment {
    _id: ID
    title: String
    description: String
    startTime: String
    endTime: String
    userId: ID
    googleEventId: String
    reminderSent: Boolean
    createdAt: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type CalendarConnection {
    success: Boolean
    message: String
    calendarId: String
  }

  type Query {
    me: User
    appointments: [Appointment]
    appointment(_id: ID!): Appointment
    getProfessionalProfile: Professional
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!, phoneNumber: String!): Auth
    login(email: String!, password: String!): Auth
    addAppointment(title: String!, description: String!, startTime: String!, endTime: String!): Appointment
    updateAppointment(_id: ID!, title: String, description: String, startTime: String, endTime: String): Appointment
    removeAppointment(_id: ID!): Appointment
    processAiMessage(message: String!): String
    createProfessionalProfile(name: String!, email: String!, phoneNumber: String!, specialty: String!, bio: String): Professional
    updateAvailability(availability: [AvailabilityInput!]!): Professional
    addService(name: String!, duration: Int!, price: Float!, description: String): Service
    updateService(_id: ID!, name: String, duration: Int, price: Float, description: String): Service
    deleteService(_id: ID!): Service
    connectGoogleCalendar(code: String!, redirectUri: String!): CalendarConnection
  }
`;

module.exports = typeDefs;
