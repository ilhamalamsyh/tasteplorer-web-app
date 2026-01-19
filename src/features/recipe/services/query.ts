import { gql } from '@apollo/client';

export const RECIPE_DETAIL_QUERY = gql`
  query RecipeDetail($id: Int!) {
    recipeDetail(id: $id) {
      id
      title
      description
      image {
        url
      }
      cookingTime
      servings
      author {
        id
        fullname
        username
        image
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
  }
`;

export const MY_RECIPE_DETAIL_QUERY = gql`
  query MyRecipeDetail($id: Int!) {
    myRecipeDetail(id: $id) {
      id
      title
      description
      image {
        url
      }
      cookingTime
      servings
      author {
        id
        fullname
        username
        image
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
  }
`;

export const RECIPE_LIST_QUERY = gql`
  query RecipeList($search: String, $after: String) {
    recipeList(search: $search, after: $after) {
      recipes {
        id
        title
        description
        servings
        cookingTime
        author {
          id
          username
          image
        }
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
        createdAt
        updatedAt
        deletedAt
      }
      meta {
        total
        hasNextPage
        endCursor
      }
    }
  }
`;

export const USER_RECIPE_LIST_QUERY = gql`
  query UserRecipeList(
    $userId: Int!
    $limit: Int
    $after: String
    $search: String
  ) {
    userRecipeList(
      userId: $userId
      limit: $limit
      after: $after
      search: $search
    ) {
      recipes {
        id
        title
        description
        cookingTime
        servings
        createdAt
        updatedAt
        image {
          id
          url
        }
        author {
          id
          username
          fullname
          image
        }
        ingredients {
          id
          ingredient
        }
        instructions {
          id
          instruction
        }
        isFavorite
      }
      meta {
        total
        currentPage
        pageSize
        totalPage
        hasNextPage
        endCursor
      }
    }
  }
`;
