import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import { print } from 'graphql';
import { GraphQLError } from 'graphql-request/dist/types';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: Date;
};

export type Role = {
  __typename?: 'Role';
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  email: Scalars['String'];
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  isEmailConfirmed: Scalars['Boolean'];
  lastLoginAt?: Maybe<Scalars['DateTime']>;
  roles?: Maybe<Array<Maybe<Role>>>;
  isActive: Scalars['Boolean'];
  name?: Maybe<Scalars['String']>;
};


export type Cursor = {
  __typename?: 'Cursor';
  beforeCursor?: Maybe<Scalars['String']>;
  afterCursor?: Maybe<Scalars['String']>;
};

export type UserPaginatorResponse = {
  __typename?: 'UserPaginatorResponse';
  cursor: Cursor;
  data: Array<User>;
};

export type LoginResponse = {
  __typename?: 'LoginResponse';
  accessToken: Scalars['String'];
  user: User;
};

export type Query = {
  __typename?: 'Query';
  me: User;
  user: User;
  users: UserPaginatorResponse;
};


export type QueryUserArgs = {
  email: Scalars['String'];
};


export type QueryUsersArgs = {
  query?: Maybe<PaginatorInputs>;
};

export type PaginatorInputs = {
  afterCursor?: Maybe<Scalars['String']>;
  beforeCursor?: Maybe<Scalars['String']>;
  limit?: Maybe<Scalars['Int']>;
  order?: Maybe<Order>;
};

export enum Order {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type Mutation = {
  __typename?: 'Mutation';
  validateForgotPasswordToken: Scalars['Boolean'];
  sendForgotPasswordEmail: Scalars['Boolean'];
  updatePasswordFromToken: Scalars['Boolean'];
  verifyEmailConfirmation: Scalars['Boolean'];
  resentConfirmEmail: Scalars['Boolean'];
  register: User;
  login: LoginResponse;
  refreshToken: LoginResponse;
  logout: Scalars['Boolean'];
  revokeRefreshToken: Scalars['Boolean'];
};


export type MutationValidateForgotPasswordTokenArgs = {
  email: Scalars['String'];
  token: Scalars['String'];
};


export type MutationSendForgotPasswordEmailArgs = {
  data: SendForgotPasswordInput;
};


export type MutationUpdatePasswordFromTokenArgs = {
  data: UpdatePasswordInput;
};


export type MutationVerifyEmailConfirmationArgs = {
  data: VerifyEmailInput;
};


export type MutationResentConfirmEmailArgs = {
  email: Scalars['String'];
};


export type MutationRegisterArgs = {
  data: RegisterInput;
};


export type MutationLoginArgs = {
  data: LoginInput;
};


export type MutationRevokeRefreshTokenArgs = {
  userId: Scalars['String'];
};

export type SendForgotPasswordInput = {
  email: Scalars['String'];
};

export type UpdatePasswordInput = {
  password: Scalars['String'];
  token: Scalars['String'];
  email: Scalars['String'];
};

export type VerifyEmailInput = {
  email: Scalars['String'];
  uuid: Scalars['String'];
};

export type RegisterInput = {
  id?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  email: Scalars['String'];
  password?: Maybe<Scalars['String']>;
};

export type LoginInput = {
  email: Scalars['String'];
  password: Scalars['String'];
  rememberMe: Scalars['Boolean'];
};

export type SendForgotPasswordEmailMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type SendForgotPasswordEmailMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'sendForgotPasswordEmail'>
);

export type UpdatePasswordFromTokenMutationVariables = Exact<{
  data: UpdatePasswordInput;
}>;


export type UpdatePasswordFromTokenMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'updatePasswordFromToken'>
);

export type ValidateForgotPasswordTokenMutationVariables = Exact<{
  email: Scalars['String'];
  token: Scalars['String'];
}>;


export type ValidateForgotPasswordTokenMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'validateForgotPasswordToken'>
);

export type LoginMutationVariables = Exact<{
  data: LoginInput;
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'LoginResponse' }
    & Pick<LoginResponse, 'accessToken'>
    & { user: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'email' | 'name'>
    ) }
  ) }
);

export type RefreshTokenMutationVariables = Exact<{ [key: string]: never; }>;


export type RefreshTokenMutation = (
  { __typename?: 'Mutation' }
  & { refreshToken: (
    { __typename?: 'LoginResponse' }
    & Pick<LoginResponse, 'accessToken'>
    & { user: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'email'>
    ) }
  ) }
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type RevokeRefreshTokensForUserMutationVariables = Exact<{
  userId: Scalars['String'];
}>;


export type RevokeRefreshTokensForUserMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'revokeRefreshToken'>
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'firstName' | 'lastName' | 'name' | 'email' | 'isEmailConfirmed'>
  ) }
);

export type RegisterMutationVariables = Exact<{
  data: RegisterInput;
}>;


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & { register: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'name' | 'email'>
  ) }
);

export type VerifyEmailConfirmationMutationVariables = Exact<{
  data: VerifyEmailInput;
}>;


export type VerifyEmailConfirmationMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'verifyEmailConfirmation'>
);

export type UsersQueryVariables = Exact<{
  query?: Maybe<PaginatorInputs>;
}>;


export type UsersQuery = (
  { __typename?: 'Query' }
  & { users: (
    { __typename?: 'UserPaginatorResponse' }
    & { data: Array<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'email' | 'name'>
    )>, cursor: (
      { __typename?: 'Cursor' }
      & Pick<Cursor, 'beforeCursor' | 'afterCursor'>
    ) }
  ) }
);

export type UserQueryVariables = Exact<{
  email: Scalars['String'];
}>;


export type UserQuery = (
  { __typename?: 'Query' }
  & { user: (
    { __typename?: 'User' }
    & Pick<User, 'id' | 'email'>
  ) }
);


export const SendForgotPasswordEmailDocument = gql`
    mutation SendForgotPasswordEmail($email: String!) {
  sendForgotPasswordEmail(data: {email: $email})
}
    `;
export const UpdatePasswordFromTokenDocument = gql`
    mutation UpdatePasswordFromToken($data: UpdatePasswordInput!) {
  updatePasswordFromToken(data: $data)
}
    `;
export const ValidateForgotPasswordTokenDocument = gql`
    mutation ValidateForgotPasswordToken($email: String!, $token: String!) {
  validateForgotPasswordToken(email: $email, token: $token)
}
    `;
export const LoginDocument = gql`
    mutation Login($data: LoginInput!) {
  login(data: $data) {
    accessToken
    user {
      id
      email
      name
    }
  }
}
    `;
export const RefreshTokenDocument = gql`
    mutation RefreshToken {
  refreshToken {
    accessToken
    user {
      id
      email
    }
  }
}
    `;
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export const RevokeRefreshTokensForUserDocument = gql`
    mutation RevokeRefreshTokensForUser($userId: String!) {
  revokeRefreshToken(userId: $userId)
}
    `;
export const MeDocument = gql`
    query Me {
  me {
    id
    firstName
    lastName
    name
    email
    isEmailConfirmed
  }
}
    `;
export const RegisterDocument = gql`
    mutation Register($data: RegisterInput!) {
  register(data: $data) {
    id
    name
    email
  }
}
    `;
export const VerifyEmailConfirmationDocument = gql`
    mutation VerifyEmailConfirmation($data: VerifyEmailInput!) {
  verifyEmailConfirmation(data: $data)
}
    `;
export const UsersDocument = gql`
    query Users($query: PaginatorInputs) {
  users(query: $query) {
    data {
      id
      email
      name
    }
    cursor {
      beforeCursor
      afterCursor
    }
  }
}
    `;
export const UserDocument = gql`
    query User($email: String!) {
  user(email: $email) {
    id
    email
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: () => Promise<T>) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = sdkFunction => sdkFunction();
export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    SendForgotPasswordEmail(variables: SendForgotPasswordEmailMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<{ data?: SendForgotPasswordEmailMutation | undefined; extensions?: any; headers: Dom.Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper(() => client.rawRequest<SendForgotPasswordEmailMutation>(print(SendForgotPasswordEmailDocument), variables, requestHeaders));
    },
    UpdatePasswordFromToken(variables: UpdatePasswordFromTokenMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<{ data?: UpdatePasswordFromTokenMutation | undefined; extensions?: any; headers: Dom.Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper(() => client.rawRequest<UpdatePasswordFromTokenMutation>(print(UpdatePasswordFromTokenDocument), variables, requestHeaders));
    },
    ValidateForgotPasswordToken(variables: ValidateForgotPasswordTokenMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<{ data?: ValidateForgotPasswordTokenMutation | undefined; extensions?: any; headers: Dom.Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper(() => client.rawRequest<ValidateForgotPasswordTokenMutation>(print(ValidateForgotPasswordTokenDocument), variables, requestHeaders));
    },
    Login(variables: LoginMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<{ data?: LoginMutation | undefined; extensions?: any; headers: Dom.Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper(() => client.rawRequest<LoginMutation>(print(LoginDocument), variables, requestHeaders));
    },
    RefreshToken(variables?: RefreshTokenMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<{ data?: RefreshTokenMutation | undefined; extensions?: any; headers: Dom.Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper(() => client.rawRequest<RefreshTokenMutation>(print(RefreshTokenDocument), variables, requestHeaders));
    },
    Logout(variables?: LogoutMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<{ data?: LogoutMutation | undefined; extensions?: any; headers: Dom.Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper(() => client.rawRequest<LogoutMutation>(print(LogoutDocument), variables, requestHeaders));
    },
    RevokeRefreshTokensForUser(variables: RevokeRefreshTokensForUserMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<{ data?: RevokeRefreshTokensForUserMutation | undefined; extensions?: any; headers: Dom.Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper(() => client.rawRequest<RevokeRefreshTokensForUserMutation>(print(RevokeRefreshTokensForUserDocument), variables, requestHeaders));
    },
    Me(variables?: MeQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<{ data?: MeQuery | undefined; extensions?: any; headers: Dom.Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper(() => client.rawRequest<MeQuery>(print(MeDocument), variables, requestHeaders));
    },
    Register(variables: RegisterMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<{ data?: RegisterMutation | undefined; extensions?: any; headers: Dom.Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper(() => client.rawRequest<RegisterMutation>(print(RegisterDocument), variables, requestHeaders));
    },
    VerifyEmailConfirmation(variables: VerifyEmailConfirmationMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<{ data?: VerifyEmailConfirmationMutation | undefined; extensions?: any; headers: Dom.Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper(() => client.rawRequest<VerifyEmailConfirmationMutation>(print(VerifyEmailConfirmationDocument), variables, requestHeaders));
    },
    Users(variables?: UsersQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<{ data?: UsersQuery | undefined; extensions?: any; headers: Dom.Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper(() => client.rawRequest<UsersQuery>(print(UsersDocument), variables, requestHeaders));
    },
    User(variables: UserQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<{ data?: UserQuery | undefined; extensions?: any; headers: Dom.Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper(() => client.rawRequest<UserQuery>(print(UserDocument), variables, requestHeaders));
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;