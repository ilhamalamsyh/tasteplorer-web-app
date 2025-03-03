import { gql } from '@apollo/client';

export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      birthDate
      email
      fullname
      username
      image
      createdAt
      updatedAt
    }
  }
`;
