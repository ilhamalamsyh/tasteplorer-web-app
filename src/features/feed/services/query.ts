import { gql } from '@apollo/client';

export const HOME_FEEDS_QUERY = gql`
  query HomeFeeds($cursor: String, $limit: Int) {
    homeFeeds(cursor: $cursor, limit: $limit) {
      feeds {
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
      nextCursor
      hasMore
    }
  }
`;

export const GET_FEED = gql`
  query GetFeed($id: ID!) {
    feed(id: $id) {
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

export const USER_FEEDS_QUERY = gql`
  query UserFeeds($userId: Int!, $cursor: String, $limit: Int) {
    userFeeds(userId: $userId, cursor: $cursor, limit: $limit) {
      feeds {
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
      nextCursor
      hasMore
    }
  }
`;
