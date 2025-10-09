import { gql } from '@apollo/client';

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      user {
        id
        email
        username
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
        username
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

export const UPLOAD_SINGLE_FILE = gql`
  mutation UploadSingleFile($file: Upload!, $setting: UploadParamInput!) {
    uploadSingleFile(file: $file, setting: $setting) {
      imageUrl
      isSuccess
    }
  }
`;
