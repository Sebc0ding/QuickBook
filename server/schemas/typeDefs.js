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
  
  type Service {
    _id: ID
    name: String
    duration: Int
    price: Float
    description: String
  }
  
  type Availability {
    _id: ID
    day: String
    startTime: String
    endTime: String
  }

  type Query {
    me: User
    appointments: [Appointment]
    appointment(_id: ID!): Appointment
    getProfessionalProfile: Professional
    getProfessionalServices: [Service]
    getProfessionalAvailability: [Availability]
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!, phoneNumber: String!): Auth
    login(email: String!, password: String!): Auth
    addAppointment(title: String!, description: String!, startTime: String!, endTime: String!): Appointment
    updateAppointment(_id: ID!, title: String, description: String, startTime: String, endTime: String): Appointment
    removeAppointment(_id: ID!): Appointment
    processAiMessage(message: String!): String
    createProfessional(name: String!, email: String!, phoneNumber: String!, specialty: String!, bio: String): Professional
    addService(name: String!, duration: Int!, price: Float!, description: String): Service
    addAvailability(day: String!, startTime: String!, endTime: String!): Availability
    connectGoogleCalendar(code: String!): Professional
  }
`;

module.exports = typeDefs;
