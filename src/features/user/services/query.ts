import { gql } from '@apollo/client';

export const CURRENT_USER = gql`
  query profile {
    currentUser {
      id
      fullname
      username
      email
      birthDate
      image
    }
  }
`;
