import { gql } from '@apollo/client';

// Login mutation
export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
        email
        phoneNumber
      }
    }
  }
`;

// Register new user mutation
export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!, $phoneNumber: String!) {
    addUser(username: $username, email: $email, password: $password, phoneNumber: $phoneNumber) {
      token
      user {
        _id
        username
        email
        phoneNumber
      }
    }
  }
`;

// Add appointment mutation
export const ADD_APPOINTMENT = gql`
  mutation addAppointment($title: String!, $description: String!, $startTime: String!, $endTime: String!) {
    addAppointment(title: $title, description: $description, startTime: $startTime, endTime: $endTime) {
      _id
      title
      description
      startTime
      endTime
      userId
      googleEventId
      reminderSent
      createdAt
    }
  }
`;

// Update appointment mutation
export const UPDATE_APPOINTMENT = gql`
  mutation updateAppointment($_id: ID!, $title: String, $description: String, $startTime: String, $endTime: String) {
    updateAppointment(_id: $_id, title: $title, description: $description, startTime: $startTime, endTime: $endTime) {
      _id
      title
      description
      startTime
      endTime
      userId
      googleEventId
      reminderSent
      createdAt
    }
  }
`;

// Remove appointment mutation
export const REMOVE_APPOINTMENT = gql`
  mutation removeAppointment($_id: ID!) {
    removeAppointment(_id: $_id) {
      _id
      title
      description
      startTime
      endTime
    }
  }
`;

// Process AI message mutation
export const PROCESS_AI_MESSAGE = gql`
  mutation processAiMessage($message: String!) {
    processAiMessage(message: $message)
  }
`;

export const CREATE_PROFESSIONAL_PROFILE = gql`
  mutation CreateProfessionalProfile($name: String!, $email: String!, $phoneNumber: String!, $specialty: String!, $bio: String) {
    createProfessionalProfile(name: $name, email: $email, phoneNumber: $phoneNumber, specialty: $specialty, bio: $bio) {
      _id
      name
      email
      phoneNumber
      specialty
      bio
    }
  }
`;

export const ADD_SERVICE = gql`
  mutation AddService($name: String!, $duration: Int!, $price: Float!, $description: String) {
    addService(name: $name, duration: $duration, price: $price, description: $description) {
      _id
      name
      duration
      price
      description
    }
  }
`;

export const UPDATE_SERVICE = gql`
  mutation UpdateService($_id: ID!, $name: String, $duration: Int, $price: Float, $description: String) {
    updateService(_id: $_id, name: $name, duration: $duration, price: $price, description: $description) {
      _id
      name
      duration
      price
      description
    }
  }
`;

export const DELETE_SERVICE = gql`
  mutation DeleteService($_id: ID!) {
    deleteService(_id: $_id) {
      _id
    }
  }
`;

export const ADD_AVAILABILITY = gql`
  mutation addAvailability($day: String!, $startTime: String!, $endTime: String!) {
    addAvailability(day: $day, startTime: $startTime, endTime: $endTime) {
      _id
      day
      startTime
      endTime
    }
  }
`;

export const CONNECT_GOOGLE_CALENDAR = gql`
  mutation connectGoogleCalendar($code: String!) {
    connectGoogleCalendar(code: $code) {
      _id
      calendarId
    }
  }
`;