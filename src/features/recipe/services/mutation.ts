import { gql } from '@apollo/client';

export const CREATE_RECIPE_MUTATION = gql`
  mutation CreateRecipe($input: RecipeInput!) {
    createRecipe(input: $input) {
      id
      title
      description
      cookingTime
      servings
      image {
        id
        url
        createdAt
        updatedAt
      }
      ingredients {
        id
        ingredient
        recipeId
        createdAt
        updatedAt
      }
      instructions {
        id
        instruction
        recipeId
        createdAt
        updatedAt
      }
      author {
        id
        username
        fullname
        email
        image
        birthDate
        createdAt
        updatedAt
      }
      isFavorite
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_RECIPE_MUTATION = gql`
  mutation UpdateRecipe($id: ID!, $input: RecipeInput!) {
    updateRecipe(id: $id, input: $input) {
      id
      title
      description
      cookingTime
      servings
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
        image
      }
      isFavorite
      createdAt
      updatedAt
    }
  }
`;
