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
      totalFollowers
      totalFollowing
      totalPosts
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
        isMe
        isFollowedByMe
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
      totalFollowers
      totalFollowing
      totalPosts
      isFollowedByMe
      isMe
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

export const FOLLOWERS_QUERY = gql`
  query Followers($userId: Int!, $cursor: Int, $limit: Int) {
    followers(userId: $userId, cursor: $cursor, limit: $limit) {
      users {
        id
        username
        fullname
        image
        isMe
        isFollowedByMe
      }
      pageInfo {
        nextCursor
        hasNext
      }
    }
  }
`;

export const FOLLOWING_QUERY = gql`
  query Following($userId: Int!, $cursor: Int, $limit: Int) {
    following(userId: $userId, cursor: $cursor, limit: $limit) {
      users {
        id
        username
        fullname
        image
        isMe
        isFollowedByMe
      }
      pageInfo {
        nextCursor
        hasNext
      }
    }
  }
`;
