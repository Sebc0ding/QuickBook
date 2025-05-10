const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    username: String
    email: String
    password: String
    phoneNumber: String
    appointments: [Appointment]
    role: String
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
    _id: ID
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
    professional: ID
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
    professionalId: ID
    serviceId: ID
    googleEventId: String
    reminderSent: Boolean
    status: String
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
    users: [User]
    user(_id: ID!): User
    appointments: [Appointment]
    appointment(_id: ID!): Appointment
    userAppointments: [Appointment]
    professionals: [Professional]
    professional(_id: ID!): Professional
    getProfessionalProfile: Professional
    getProfessionalServices: [Service]
    getProfessionalAvailability: [Availability]
    getAvailableTimes(date: String!, professionalId: ID!, serviceId: ID!): [String]
    getService(_id: ID!): Service
    getServices: [Service]
    getProfessionalById(_id: ID!): Professional
    getAllProfessionals: [Professional]
    getAvailabilitySlots(date: String!, professionalId: ID!): [String]
    checkAvailability(professionalId: ID!, date: String!): Boolean
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!, phoneNumber: String!): Auth
    login(email: String!, password: String!): Auth
    updateUser(_id: ID!, username: String, email: String, password: String, phoneNumber: String): User
    deleteUser(_id: ID!): User
    
    addAppointment(title: String!, description: String!, startTime: String!, endTime: String!): Appointment
    bookAppointment(professionalId: ID!, serviceId: ID!, date: String!, time: String!): Appointment
    updateAppointment(_id: ID!, title: String, description: String, startTime: String, endTime: String): Appointment
    removeAppointment(_id: ID!): Appointment
    cancelAppointment(_id: ID!): Appointment
    
   
    createProfessional(name: String!, email: String!, phoneNumber: String!, specialty: String!, bio: String): Professional
    createProfessionalProfile(name: String!, email: String!, phoneNumber: String!, specialty: String!, bio: String): Professional
    updateProfessionalProfile(_id: ID!, name: String, email: String, phoneNumber: String, specialty: String, bio: String): Professional
    deleteProfessionalProfile(_id: ID!): Professional
    
    updateAvailability(availability: [AvailabilityInput!]!): Professional
    addAvailability(day: String!, startTime: String!, endTime: String!): Professional
    removeAvailability(_id: ID!): Professional
    
    addService(name: String!, duration: Int!, price: Float!, description: String): Service
    updateService(_id: ID!, name: String, duration: Int, price: Float, description: String): Service
    deleteService(_id: ID!): Service
    
    connectGoogleCalendar(code: String!, redirectUri: String!): CalendarConnection
    disconnectGoogleCalendar: Boolean
    
    processAiMessage(message: String!): String
    processMessage(message: String!): String
    sendReminderEmail(appointmentId: ID!): Boolean
    sendReminderSMS(appointmentId: ID!): Boolean
    sendTextMessage(to: String!, body: String!): Boolean
  }
`;

module.exports = typeDefs;
