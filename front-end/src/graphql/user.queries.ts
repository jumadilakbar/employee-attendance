import { gql } from '@apollo/client';
import { User, UserRole } from '@/types/graphql';

// List Users Query
export const LIST_USERS_QUERY = gql`
  query ListUsers($filter: UserFilter, $sort: SortInput, $page: Int, $limit: Int) {
    users(filter: $filter, sort: $sort, page: $page, limit: $limit) {
      id
      username
      email
      role
      createdAt
      updatedAt
    }
  }
`;

export interface UserFilter {
  username?: string;
  email?: string;
  role?: UserRole;
}

export interface SortInput {
  field?: string;
  order?: 'ASC' | 'DESC';
}

export interface ListUsersVariables {
  filter?: UserFilter;
  sort?: SortInput;
  page?: number;
  limit?: number;
}

export interface ListUsersData {
  users: User[];
}

// Users Pagination Query
export const USERS_PAGINATION_QUERY = gql`
  query UsersPagination($filter: UserFilter, $page: Int, $limit: Int) {
    usersPagination(filter: $filter, page: $page, limit: $limit) {
      totalCount
      totalPages
      currentPage
      limit
      hasNextPage
      hasPreviousPage
    }
  }
`;

export interface UsersPaginationVariables {
  filter?: UserFilter;
  page?: number;
  limit?: number;
}

export interface UsersPaginationData {
  usersPagination: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

// Get User Query
export const GET_USER_QUERY = gql`
  query GetUser($id: String!) {
    user(id: $id) {
      id
      username
      email
      role
      createdAt
      updatedAt
    }
  }
`;

export interface GetUserVariables {
  id: string;
}

export interface GetUserData {
  user: User;
}

// Create User Mutation
export const CREATE_USER_MUTATION = gql`
  mutation CreateUser($username: String!, $email: String!, $password: String!, $role: UserRole) {
    createUser(username: $username, email: $email, password: $password, role: $role) {
      id
      username
      email
      role
      createdAt
      updatedAt
    }
  }
`;

export interface CreateUserVariables {
  username: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface CreateUserData {
  createUser: User;
}

// Update User Mutation
export const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($id: String!, $username: String, $email: String, $role: UserRole) {
    updateUser(id: $id, username: $username, email: $email, role: $role) {
      id
      username
      email
      role
      createdAt
      updatedAt
    }
  }
`;

export interface UpdateUserVariables {
  id: string;
  username?: string;
  email?: string;
  role?: UserRole;
}

export interface UpdateUserData {
  updateUser: User;
}

// Delete User Mutation
export const DELETE_USER_MUTATION = gql`
  mutation DeleteUser($id: String!) {
    deleteUser(id: $id)
  }
`;

export interface DeleteUserVariables {
  id: string;
}

export interface DeleteUserData {
  deleteUser: boolean;
}

