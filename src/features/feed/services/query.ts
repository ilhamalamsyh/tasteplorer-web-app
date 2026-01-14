import { gql } from '@apollo/client';

export const GET_FEED = gql`
  query GetFeed($id: ID!) {
    feed(id: $id) {
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
