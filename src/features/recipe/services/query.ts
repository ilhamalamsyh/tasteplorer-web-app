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
