import { createContext, useContext, useMemo, useState } from "react";
import jwtDecode from "jwt-decode";
import { useRouter } from "next/router";
import { graphQLSdk } from "@/app/lib/api_sdk";
import { useNotify } from "use-notify-rxjs";
import { useLoginMutation } from "@/generated/graphql";

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

// function catchGraphError(err: any) {
//   let errors = "";
//
//   if ((err.response?.errors?.length ?? 0) > 0) {
//     errors = err.response.errors.map((e: any) => e.message);
//   }
//
//   return { data: undefined, errors };
// }

function AuthProvider(props: any) {
  const router = useRouter();
  const notify = useNotify();

  const [state, setState] = useState<{ userId?: string; accessToken?: string }>({});
  const decodedToken = useMemo(() => (state.accessToken ? jwtDecode<DecodedJWT>(state.accessToken) : undefined), [
    state.accessToken,
  ]);

  async function handleLogin(loginParams: LoginParams) {
    const { data, errors } = await graphQLSdk.Login({ data: loginParams });

    if (errors || !data?.login) {
      if (Array.isArray(errors)) {
        ((errors as unknown) as string[]).forEach(err => notify.error(err));
      }
    }

    const { accessToken, user } = data?.login ?? {};
    setState({ ...state, userId: user?.id, accessToken });
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
    await graphQLSdk.Logout();
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
    console.log({ expiresAt });
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
