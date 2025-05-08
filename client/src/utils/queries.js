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
