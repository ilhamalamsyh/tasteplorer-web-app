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

export const USERS_QUERY = gql`
  query Users($input: UsersQueryInput) {
    users(input: $input) {
      data {
        id
        username
        fullname
        email
        image
        createdAt
        updatedAt
      }
      total
      nextCursor
      hasMore
    }
  }
`;
