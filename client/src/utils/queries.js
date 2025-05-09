import { gql } from '@apollo/client';

export const QUERY_ME = gql`
  query me {
    me {
      _id
      username
      email
      phoneNumber
      appointments {
        _id
        title
        description
        startTime
        endTime
        createdAt
      }
    }
  }
`;

export const QUERY_APPOINTMENTS = gql`
  query appointments {
    appointments {
      _id
      title
      description
      startTime
      endTime
      googleEventId
      createdAt
    }
  }
`;

export const QUERY_APPOINTMENT = gql`
  query appointment($id: ID!) {
    appointment(_id: $id) {
      _id
      title
      description
      startTime
      endTime
      googleEventId
      createdAt
    }
  }
`;
// Add these to your existing queries file

export const GET_PROFESSIONAL_PROFILE = gql`
  query getProfessionalProfile {
    getProfessionalProfile {
      _id
      name
      email
      phoneNumber
      specialty
      bio
      calendarId
    }
  }
`;

export const GET_PROFESSIONAL_SERVICES = gql`
  query getProfessionalServices {
    getProfessionalServices {
      _id
      name
      duration
      price
      description
    }
  }
`;

export const GET_PROFESSIONAL_AVAILABILITY = gql`
  query getProfessionalAvailability {
    getProfessionalAvailability {
      _id
      day
      startTime
      endTime
    }
  }
`;