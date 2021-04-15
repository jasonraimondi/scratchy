import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
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

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  email: Scalars['String'];
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  isEmailConfirmed: Scalars['Boolean'];
  lastLoginAt?: Maybe<Scalars['DateTime']>;
  isActive: Scalars['Boolean'];
  name?: Maybe<Scalars['String']>;
};


export type LoginResponse = {
  __typename?: 'LoginResponse';
  accessToken: Scalars['String'];
  accessTokenExpiresAt: Scalars['Int'];
  refreshTokenExpiresAt?: Maybe<Scalars['Int']>;
  user: User;
};

export type PaginatorMeta = {
  __typename?: 'PaginatorMeta';
  previousLink?: Maybe<Scalars['String']>;
  nextLink?: Maybe<Scalars['String']>;
};

export type UserPaginatorResponse = {
  __typename?: 'UserPaginatorResponse';
  meta: PaginatorMeta;
  data: Array<User>;
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
  query?: Maybe<UserPaginatorInputs>;
};

export type UserPaginatorInputs = {
  skip?: Maybe<Scalars['Int']>;
  take?: Maybe<Scalars['Int']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  login: LoginResponse;
  refreshAccessToken: LoginResponse;
  logout?: Maybe<Scalars['Boolean']>;
  revokeRefreshToken?: Maybe<Scalars['Boolean']>;
  register: User;
  resendConfirmEmail: Scalars['Boolean'];
  validateForgotPasswordToken: Scalars['Boolean'];
  sendForgotPasswordEmail: Scalars['Boolean'];
  updatePasswordFromToken: LoginResponse;
  verifyEmailConfirmation: Scalars['Boolean'];
};


export type MutationLoginArgs = {
  data: LoginInput;
};


export type MutationRevokeRefreshTokenArgs = {
  userId: Scalars['String'];
};


export type MutationRegisterArgs = {
  data: RegisterInput;
};


export type MutationResendConfirmEmailArgs = {
  email: Scalars['String'];
};


export type MutationValidateForgotPasswordTokenArgs = {
  data: ValidateForgotPasswordTokenInput;
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

export type LoginInput = {
  email: Scalars['String'];
  password: Scalars['String'];
  rememberMe: Scalars['Boolean'];
};

export type RegisterInput = {
  id?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  email: Scalars['String'];
  password?: Maybe<Scalars['String']>;
};

export type ValidateForgotPasswordTokenInput = {
  email: Scalars['String'];
  token: Scalars['String'];
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
  & { updatePasswordFromToken: (
    { __typename?: 'LoginResponse' }
    & Pick<LoginResponse, 'accessToken'>
    & { user: (
      { __typename?: 'User' }
      & Pick<User, 'email' | 'firstName' | 'lastName' | 'name'>
    ) }
  ) }
);

export type ValidateForgotPasswordTokenMutationVariables = Exact<{
  data: ValidateForgotPasswordTokenInput;
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

export type RefreshAccessTokenMutationVariables = Exact<{ [key: string]: never; }>;


export type RefreshAccessTokenMutation = (
  { __typename?: 'Mutation' }
  & { refreshAccessToken: (
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


export const SendForgotPasswordEmailDocument = `
    mutation SendForgotPasswordEmail($email: String!) {
  sendForgotPasswordEmail(data: {email: $email})
}
    `;
export const UpdatePasswordFromTokenDocument = `
    mutation UpdatePasswordFromToken($data: UpdatePasswordInput!) {
  updatePasswordFromToken(data: $data) {
    accessToken
    user {
      email
      firstName
      lastName
      name
    }
  }
}
    `;
export const ValidateForgotPasswordTokenDocument = `
    mutation ValidateForgotPasswordToken($data: ValidateForgotPasswordTokenInput!) {
  validateForgotPasswordToken(data: $data)
}
    `;
export const LoginDocument = `
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
export const RefreshAccessTokenDocument = `
    mutation RefreshAccessToken {
  refreshAccessToken {
    accessToken
    user {
      id
      email
    }
  }
}
    `;
export const LogoutDocument = `
    mutation Logout {
  logout
}
    `;
export const RevokeRefreshTokensForUserDocument = `
    mutation RevokeRefreshTokensForUser($userId: String!) {
  revokeRefreshToken(userId: $userId)
}
    `;
export const MeDocument = `
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
export const RegisterDocument = `
    mutation Register($data: RegisterInput!) {
  register(data: $data) {
    id
    name
    email
  }
}
    `;
export const VerifyEmailConfirmationDocument = `
    mutation VerifyEmailConfirmation($data: VerifyEmailInput!) {
  verifyEmailConfirmation(data: $data)
}
    `;
export const UserDocument = `
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
    SendForgotPasswordEmail(variables: SendForgotPasswordEmailMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SendForgotPasswordEmailMutation> {
      return withWrapper(() => client.request<SendForgotPasswordEmailMutation>(SendForgotPasswordEmailDocument, variables, requestHeaders));
    },
    UpdatePasswordFromToken(variables: UpdatePasswordFromTokenMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdatePasswordFromTokenMutation> {
      return withWrapper(() => client.request<UpdatePasswordFromTokenMutation>(UpdatePasswordFromTokenDocument, variables, requestHeaders));
    },
    ValidateForgotPasswordToken(variables: ValidateForgotPasswordTokenMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ValidateForgotPasswordTokenMutation> {
      return withWrapper(() => client.request<ValidateForgotPasswordTokenMutation>(ValidateForgotPasswordTokenDocument, variables, requestHeaders));
    },
    Login(variables: LoginMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<LoginMutation> {
      return withWrapper(() => client.request<LoginMutation>(LoginDocument, variables, requestHeaders));
    },
    RefreshAccessToken(variables?: RefreshAccessTokenMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<RefreshAccessTokenMutation> {
      return withWrapper(() => client.request<RefreshAccessTokenMutation>(RefreshAccessTokenDocument, variables, requestHeaders));
    },
    Logout(variables?: LogoutMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<LogoutMutation> {
      return withWrapper(() => client.request<LogoutMutation>(LogoutDocument, variables, requestHeaders));
    },
    RevokeRefreshTokensForUser(variables: RevokeRefreshTokensForUserMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<RevokeRefreshTokensForUserMutation> {
      return withWrapper(() => client.request<RevokeRefreshTokensForUserMutation>(RevokeRefreshTokensForUserDocument, variables, requestHeaders));
    },
    Me(variables?: MeQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<MeQuery> {
      return withWrapper(() => client.request<MeQuery>(MeDocument, variables, requestHeaders));
    },
    Register(variables: RegisterMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<RegisterMutation> {
      return withWrapper(() => client.request<RegisterMutation>(RegisterDocument, variables, requestHeaders));
    },
    VerifyEmailConfirmation(variables: VerifyEmailConfirmationMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<VerifyEmailConfirmationMutation> {
      return withWrapper(() => client.request<VerifyEmailConfirmationMutation>(VerifyEmailConfirmationDocument, variables, requestHeaders));
    },
    User(variables: UserQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UserQuery> {
      return withWrapper(() => client.request<UserQuery>(UserDocument, variables, requestHeaders));
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;