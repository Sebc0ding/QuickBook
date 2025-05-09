import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

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

export const REMOVE_APPOINTMENT = gql`
  mutation removeAppointment($_id: ID!) {
    removeAppointment(_id: $_id) {
      _id
    }
  }
`;

export const PROCESS_AI_MESSAGE = gql`
  mutation processAiMessage($message: String!) {
    processAiMessage(message: $message)
  }
`;

export const CREATE_PROFESSIONAL = gql`
  mutation CreateProfessional($name: String!, $email: String!, $phoneNumber: String!, $specialty: String!, $bio: String) {
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
  import { gql } from '@apollo/client'

  export const DELETE_SERVICE = gql`
    mutation DeleteService($_id: ID!) {
      deleteService(_id: $_id) {
        _id
      }
    }
  `

  export const ADD_AVAILABILITY = gql`
    mutation UpdateAvailability($availability: [AvailabilityInput!]!) {
      updateAvailability(availability: $availability) {
        _id
        name
        availability {
          day
          startTime
          endTime
        }
      }
    }
  `
