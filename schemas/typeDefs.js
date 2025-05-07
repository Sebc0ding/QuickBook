const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    phoneNumber: String
    appointments: [Appointment]
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
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!, phoneNumber: String!): Auth
    login(email: String!, password: String!): Auth
    addAppointment(title: String!, description: String!, startTime: String!, endTime: String!): Appointment
    updateAppointment(_id: ID!, title: String, description: String, startTime: String, endTime: String): Appointment
    removeAppointment(_id: ID!): Appointment
    processAiMessage(message: String!): String
  }
`;

module.exports = typeDefs;
