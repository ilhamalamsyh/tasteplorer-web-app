import { gql } from '@apollo/client';

export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      birthDate
      email
      fullname
      username
      image
      createdAt
      updatedAt
    }
  }
`;

export const FOLLOW_USER = gql`
  mutation FollowUser($followerId: Int!, $followingId: Int!) {
    followUser(followerId: $followerId, followingId: $followingId)
  }
`;

export const UNFOLLOW_USER = gql`
  mutation UnfollowUser($followerId: Int!, $followingId: Int!) {
    unfollowUser(followerId: $followerId, followingId: $followingId)
  }
`;
