import { gql } from '@apollo/client';

export const CREATE_FEED_MUTATION = gql`
  mutation CreateFeed($input: CreateFeedInput!) {
    createFeed(input: $input) {
      id
      user {
        id
        username
        profileImageUrl
      }
      recipe {
        id
        title
      }
      content
      createdAt
      updatedAt
      images {
        id
        imageUrl
        position
      }
    }
  }
`;

export const UPDATE_FEED_MUTATION = gql`
  mutation UpdateFeed($id: ID!, $input: UpdateFeedInput!) {
    updateFeed(id: $id, input: $input) {
      id
      user {
        id
        username
        profileImageUrl
      }
      recipe {
        id
        title
      }
      content
      createdAt
      updatedAt
      images {
        id
        imageUrl
        position
      }
    }
  }
`;

export const DELETE_FEED_MUTATION = gql`
  mutation DeleteFeed($id: ID!) {
    deleteFeed(id: $id) {
      success
      message
    }
  }
`;
