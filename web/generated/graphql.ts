import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import { GraphQLError } from 'graphql-request/dist/types';
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
  validateForgotPasswordToken: Scalars['Boolean'];
  sendForgotPasswordEmail: Scalars['Boolean'];
  updatePasswordFromToken: LoginResponse;
  verifyEmailConfirmation: Scalars['Boolean'];
  register: User;
  resendConfirmEmail: Scalars['Boolean'];
  login: LoginResponse;
  refreshToken: LoginResponse;
  logout: Scalars['Boolean'];
  revokeRefreshToken: Scalars['Boolean'];
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


export type MutationRegisterArgs = {
  data: RegisterInput;
};


export type MutationResendConfirmEmailArgs = {
  email: Scalars['String'];
};


export type MutationLoginArgs = {
  data: LoginInput;
};


export type MutationRevokeRefreshTokenArgs = {
  userId: Scalars['String'];
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
export const RefreshTokenDocument = `
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
    SendForgotPasswordEmail(variables: SendForgotPasswordEmailMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<{ data?: SendForgotPasswordEmailMutation | undefined; extensions?: any; headers: Dom.Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper(() => client.rawRequest<SendForgotPasswordEmailMutation>(SendForgotPasswordEmailDocument, variables, requestHeaders));
    },
    UpdatePasswordFromToken(variables: UpdatePasswordFromTokenMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<{ data?: UpdatePasswordFromTokenMutation | undefined; extensions?: any; headers: Dom.Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper(() => client.rawRequest<UpdatePasswordFromTokenMutation>(UpdatePasswordFromTokenDocument, variables, requestHeaders));
    },
    ValidateForgotPasswordToken(variables: ValidateForgotPasswordTokenMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<{ data?: ValidateForgotPasswordTokenMutation | undefined; extensions?: any; headers: Dom.Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper(() => client.rawRequest<ValidateForgotPasswordTokenMutation>(ValidateForgotPasswordTokenDocument, variables, requestHeaders));
    },
    Login(variables: LoginMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<{ data?: LoginMutation | undefined; extensions?: any; headers: Dom.Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper(() => client.rawRequest<LoginMutation>(LoginDocument, variables, requestHeaders));
    },
    RefreshToken(variables?: RefreshTokenMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<{ data?: RefreshTokenMutation | undefined; extensions?: any; headers: Dom.Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper(() => client.rawRequest<RefreshTokenMutation>(RefreshTokenDocument, variables, requestHeaders));
    },
    Logout(variables?: LogoutMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<{ data?: LogoutMutation | undefined; extensions?: any; headers: Dom.Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper(() => client.rawRequest<LogoutMutation>(LogoutDocument, variables, requestHeaders));
    },
    RevokeRefreshTokensForUser(variables: RevokeRefreshTokensForUserMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<{ data?: RevokeRefreshTokensForUserMutation | undefined; extensions?: any; headers: Dom.Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper(() => client.rawRequest<RevokeRefreshTokensForUserMutation>(RevokeRefreshTokensForUserDocument, variables, requestHeaders));
    },
    Me(variables?: MeQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<{ data?: MeQuery | undefined; extensions?: any; headers: Dom.Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper(() => client.rawRequest<MeQuery>(MeDocument, variables, requestHeaders));
    },
    Register(variables: RegisterMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<{ data?: RegisterMutation | undefined; extensions?: any; headers: Dom.Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper(() => client.rawRequest<RegisterMutation>(RegisterDocument, variables, requestHeaders));
    },
    VerifyEmailConfirmation(variables: VerifyEmailConfirmationMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<{ data?: VerifyEmailConfirmationMutation | undefined; extensions?: any; headers: Dom.Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper(() => client.rawRequest<VerifyEmailConfirmationMutation>(VerifyEmailConfirmationDocument, variables, requestHeaders));
    },
    User(variables: UserQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<{ data?: UserQuery | undefined; extensions?: any; headers: Dom.Headers; status: number; errors?: GraphQLError[] | undefined; }> {
        return withWrapper(() => client.rawRequest<UserQuery>(UserDocument, variables, requestHeaders));
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;