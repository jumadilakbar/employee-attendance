import { gql } from '@apollo/client';
import { LoginResponse, RegisterResponse, User } from '@/types/graphql';

// Login Mutation
export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      access_token
    }
  }
`;

export interface LoginVariables {
  email: string;
  password: string;
}

export interface LoginData {
  login: {
    access_token: string;
  };
}

// Register Mutation
export const REGISTER_MUTATION = gql`
  mutation Register($username: String!, $email: String!, $password: String!, $role: UserRole) {
    register(username: $username, email: $email, password: $password, role: $role) {
      access_token
    }
  }
`;

export interface RegisterVariables {
  username: string;
  email: string;
  password: string;
  role?: 'ADMIN' | 'EMPLOYEE';
}

export interface RegisterData {
  register: {
    access_token: string;
  };
}

// Auth Me Query
export const AUTH_ME_QUERY = gql`
  query AuthMe {
    authMe {
      id
      username
      email
      role
      createdAt
      updatedAt
    }
  }
`;

export interface AuthMeData {
  authMe: User;
}

