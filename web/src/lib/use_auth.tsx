import { createContext, useContext, useMemo, useState } from "react";
import jwtDecode from "jwt-decode";
import { useRouter } from "next/router";
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
  const [state, setState] = useState<{ userId?: string; accessToken?: string }>({});
  const decodedToken = useMemo(() => (state.accessToken ? jwtDecode<DecodedJWT>(state.accessToken) : undefined), [
    state.accessToken,
  ]);

  async function handleLogin(loginParams: LoginParams) {
    const { data, errors } = await graphQLSdk.Login({ data: loginParams });

    if (errors || !data?.login) {
      console.log(errors);
      throw new Error("invalid login request");
    }

    const { accessToken, user } = data.login;
    setState({ ...state, userId: user.id, accessToken });
    await router.push("/app/dashboard");
  }

  async function handleRefreshToken() {
    const { data, errors } = await graphQLSdk.RefreshToken();

    if (errors || !data?.refreshToken) {
      console.log(errors);
      throw new Error("invalid refreshToken request");
    }

    const { accessToken, user } = data.refreshToken;
    setState({ ...state, userId: user.id, accessToken });
  }

  async function handleLogout() {
    const { data, errors } = await graphQLSdk.Logout();
    console.log(data, errors);
    setState({});
    await router.replace("/login");
  }

  async function handleRevokeToken() {
    if (state.userId) {
      const { data, errors } = await graphQLSdk.RevokeRefreshTokensForUser({ userId: state.userId });
      console.log(data, errors);
    }
  }

  function isAuthenticated() {
    if (!decodedToken) return false;
    const expiresAt = new Date(decodedToken.exp * 1000);
    return new Date() < expiresAt;
  }

  async function setAccessToken(accessToken: string) {
    const payload = jwtDecode<DecodedJWT>(accessToken);
    setState({ ...state, accessToken, userId: payload.sub });
  }

  console.log({ isAuthenticated: isAuthenticated() });

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        handleLogin,
        handleLogout,
        handleRefreshToken,
        handleRevokeToken,
        setAccessToken,
      }}
      {...props}
    />
  );
}

type UseAuth = {
  isAuthenticated(): () => boolean;
  handleLogin(data: LoginParams): Promise<void>;
  handleLogout(): Promise<void>;
  handleRefreshToken(): Promise<void>;
  handleRevokeToken(): Promise<void>;
  setAccessToken(token: string): void;
};

const useAuth = () => useContext<UseAuth>(AuthContext);

export { AuthProvider, useAuth };
