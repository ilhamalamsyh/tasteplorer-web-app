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
