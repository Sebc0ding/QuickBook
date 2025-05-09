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
    user: User
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

  type Query {
    me: User
    appointments: [Appointment]
    appointment(_id: ID!): Appointment
    professionalServices: [Service]
    professional: Professional
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!, phoneNumber: String!): Auth
    login(email: String!, password: String!): Auth
    addAppointment(title: String!, description: String!, startTime: String!, endTime: String!): Appointment
    updateAppointment(_id: ID!, title: String, description: String, startTime: String, endTime: String): Appointment
    removeAppointment(_id: ID!): Appointment
    processAiMessage(message: String!): String
    createProfessionalProfile(name: String!, email: String!, phoneNumber: String!, specialty: String!, bio: String): Professional
    addService(name: String!, duration: Int!, price: Float!, description: String): Service
    updateService(_id: ID!, name: String, duration: Int, price: Float, description: String): Service
    deleteService(_id: ID!): Service
    updateAvailability(availability: [AvailabilityInput!]!): Professional
  }

  input AvailabilityInput {
    day: String!
    startTime: String!
    endTime: String!
  }
`;

module.exports = typeDefs;
