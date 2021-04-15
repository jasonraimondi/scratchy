import { createContext, useContext, useMemo, useState } from "react";
import jwtDecode from "jwt-decode";
import { useRouter } from "next/router";
import { useNotify } from "use-notify-rxjs";
import { parseCookies } from "nookies";

import { graphQLClient, graphQLSdk } from "@/app/lib/api_sdk";
import { attemptWithBackoff } from "@/app/lib/utils/attemptWithBackoff";

// @ts-ignore
const AuthContext = createContext<UseAuth>();

export type DecodedJWT = {
  email: string;
  exp: number;
  iat: number;
  isEmailConfirmed: boolean;
  nbf: number;
  sub: string;
};

export type LoginParams = {
  email: string;
  password: string;
  rememberMe: boolean;
};

let count = 0;

function AuthProvider(props: any) {
  const router = useRouter();
  const notify = useNotify();

  const [state, setState] = useState<{ userId?: string; accessToken?: string; canRefresh?: boolean }>({});

  const decode = () => (state.accessToken ? jwtDecode<DecodedJWT>(state.accessToken) : undefined);
  const decodedToken = useMemo(decode, [state.accessToken]);

  const cookies = useMemo(() => parseCookies(), [state.accessToken]);

  async function handleLogin(loginParams: LoginParams) {
    try {
      const { login } = await graphQLSdk.Login({ data: loginParams });
      setAccessToken(login.accessToken);
      notify.success({ title: "Login Success", message: "" });
      await router.push("/app/dashboard");
    } catch (error) {
      notify.success({ title: "Login Error", message: error.message });
    }
  }

  async function handleRefreshToken() {
    if (cookies.canRefresh !== "y") return false;

    const attemptRefresh = async () => {
      const { refreshAccessToken } = await graphQLSdk.RefreshAccessToken();
      setAccessToken(refreshAccessToken.accessToken);
      notify.success("Token Refreshed");
    }

    try {
      const attempts = 2;
      await attemptWithBackoff(attemptRefresh, attempts);
      return true;
    } catch(err) {
      notify.error(err.message);
      return false;
    }
  }

  async function handleLogout() {
    try {
      await graphQLSdk.Logout();
      notify.info({ title: "Goodbye", message: "Logging out", ttl: 10000 });
      setState({});
      await router.replace("/login");
    } catch (error) {
      notify.error(error.message);
    }
  }

  async function handleRevokeToken() {
    if (state.userId) await graphQLSdk.RevokeRefreshTokensForUser({ userId: state.userId });
    await handleLogout();
  }

  function isAuthenticated() {
    if (!state.accessToken || !decodedToken) return false;
    const expiresAt = new Date(decodedToken.exp * 1000);
    return new Date() < expiresAt;
  }

  function setAccessToken(accessToken: string) {
    graphQLClient.setHeader("Authorization", `Bearer ${accessToken}`);
    console.log("set graphql headers")
    const payload = jwtDecode<DecodedJWT>(accessToken);
    setState({ ...state, accessToken, userId: payload.sub });
  }

  console.log({ isAuthenticated: isAuthenticated(), count: count++ });

  return (
    <AuthContext.Provider
      value={{
        accessToken: state.accessToken,
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
  accessToken: string;
  isAuthenticated(): () => boolean;
  handleLogin(data: LoginParams): Promise<void>;
  handleLogout(): Promise<void>;
  /**
   * Returns true if token refreshes, otherwise false
   */
  handleRefreshToken(): Promise<boolean>;
  handleRevokeToken(): Promise<void>;
  setAccessToken(token: string): void;
};

const useAuth = () => useContext<UseAuth>(AuthContext);

export { AuthProvider, useAuth };
