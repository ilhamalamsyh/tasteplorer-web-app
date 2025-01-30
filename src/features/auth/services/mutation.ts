import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      user {
        id
        email
        fullname
        birthDate
        image
        createdAt
        updatedAt
        deletedAt
      }
      token
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($input: UserRegisterInput!) {
    register(input: $input) {
      user {
        id
        email
        fullname
        birthDate
        image
        createdAt
        updatedAt
        deletedAt
      }
      token
    }
  }
`;
