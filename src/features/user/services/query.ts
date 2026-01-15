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

export const MY_RECIPE_LIST_QUERY = gql`
  query MyRecipeList($after: String, $limit: Int, $search: String) {
    myRecipeList(after: $after, limit: $limit, search: $search) {
      recipes {
        id
        title
        description
        servings
        cookingTime
        createdAt
        updatedAt
        image {
          id
          url
        }
        ingredients {
          id
          ingredient
        }
        instructions {
          id
          instruction
        }
        author {
          id
          username
          fullname
          email
        }
      }
      meta {
        total
        endCursor
        hasNextPage
      }
    }
  }
`;

export const USER_PROFILE_QUERY = gql`
  query UserProfile($id: ID!) {
    userProfile(id: $id) {
      id
      fullname
      username
      email
      birthDate
      image
      followers {
        data {
          id
          username
        }
        total
      }
      following {
        data {
          id
          username
        }
        total
      }
    }
  }
`;

export const USER_RECIPE_LIST_QUERY = gql`
  query UserRecipeList(
    $userId: Int!
    $search: String
    $after: String
    $limit: Int
  ) {
    userRecipeList(
      userId: $userId
      search: $search
      after: $after
      limit: $limit
    ) {
      recipes {
        id
        title
        description
        servings
        cookingTime
        image {
          url
        }
        ingredients {
          id
          ingredient
        }
        instructions {
          id
          instruction
        }
      }
      meta {
        total
        endCursor
        hasNextPage
      }
    }
  }
`;

export const USER_SUGGESTION_LIST_QUERY = gql`
  query UserSuggestionList($limit: Int, $offset: Int) {
    userSuggestionList(limit: $limit, offset: $offset) {
      users {
        userId
        suggestionScore
        suggestionReason
        mutualFollowerCount
        followerCount
        username
        fullName
      }
      hasMore
      totalCount
    }
  }
`;

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
