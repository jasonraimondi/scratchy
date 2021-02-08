import { createContext, useContext, useMemo, useState } from "react";
import jwtDecode from "jwt-decode";
import { useRouter } from "next/router";

import { User } from "@/generated/graphql";
import { graphQLSdk } from "@/app/lib/api_sdk";

// @ts-ignore
const AuthContext = createContext<UseAuth>();

export interface DecodedJWT {
  email: string;
  exp: number;
  iat: number;
  isEmailConfirmed: boolean;
  nbf: number;
  sub: string;
}


export interface LoginParams {
  email: string;
  password: string;
  rememberMe: boolean;
}

function AuthProvider(props: any) {
  const router = useRouter();
  const [state, setState] = useState<{ user?: Partial<User>; accessToken?: string; }>({});
  const decodedToken = useMemo(() => state.accessToken ? jwtDecode<DecodedJWT>(state.accessToken) : undefined, [state.accessToken]);

  const handleLogin = async (loginParams: LoginParams) => {
    const { data, errors } = await graphQLSdk.Login({ data: loginParams });

    if (errors || !data?.login) {
      console.log(errors);
      throw new Error("invalid login request");
    }

    const { accessToken, user } = data.login;
    setState({ ...state, user, accessToken });
    await router.push("/app/dashboard");
  };

  const handleRefreshToken = async () => {
    const { data, errors } = await graphQLSdk.RefreshToken();

    if (errors || !data?.refreshToken) {
      console.log(errors);
      throw new Error("invalid refreshToken request");
    }

    const { accessToken, user } = data.refreshToken;
    setState({ ...state, user, accessToken });
  };

  const handleLogout = async () => {
    const { data, errors } = await graphQLSdk.Logout();
    console.log(data, errors);
    setState({});
    await router.replace("/login");
  };

  const handleRevokeToken = async () => {
    if (state.user?.id) {
      const { data, errors } = await graphQLSdk.RevokeRefreshTokensForUser({ userId: state.user.id });
      console.log(data, errors);
    }
  };

  const isAuthenticated = () => {
    if (!decodedToken) return false;
    const expiresAt = new Date(decodedToken.exp * 1000);
    return new Date() < expiresAt;
  };

  console.log({ isAuthenticated: isAuthenticated() });
  console.log(state, decodedToken);

  return <AuthContext.Provider value={{
    isAuthenticated,
    handleLogin,
    handleLogout,
    handleRefreshToken,
    handleRevokeToken,
  }} {...props} />;
}

type UseAuth = {
  isAuthenticated(): () => boolean;
  handleLogin(data: LoginParams): Promise<void>;
  handleLogout(): Promise<void>;
  handleRefreshToken(): Promise<void>
  handleRevokeToken(): Promise<void>;
}

const useAuth = () => useContext<UseAuth>(AuthContext);

export { AuthProvider, useAuth };
