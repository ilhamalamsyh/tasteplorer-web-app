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
      recipeId
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
