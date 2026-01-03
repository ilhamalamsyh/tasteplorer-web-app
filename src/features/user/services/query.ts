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
