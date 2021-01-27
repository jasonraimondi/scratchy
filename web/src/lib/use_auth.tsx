import crypto from "crypto";
import jwt_decode from "jwt-decode";
import { useRouter } from "next/router";
import querystring from "querystring";
import { createContext, useContext, useEffect, useState } from "react";

import { graphQLClient } from "@/app/lib/api_sdk";
import cookieService from "@/app/lib/cookie_service";
import { httpClient } from "@/app/lib/http_client";
import { base64urlencode } from "@/app/lib/utils/base64";

type DecodedJWT = {
  sub: string;
  exp: number;
  nbf: number;
  iat: number;
  jti: string;
  cid: string;
  scope: string;

  email: string;
  isActive: boolean;
}

type DecodedAccessToken = {
  token: string;
  expiresAt: number;
  userId: string;
  email: string;
  isActive: string;
}

type DecodedRefreshToken = {
  token: string;
  expiresAt: number;
  userId: string;
}

const clientId = process.env.NEXT_PUBLIC_API_CLIENT_ID;
const redirectUri = process.env.NEXT_PUBLIC_API_URL_REDIRECT;

// @ts-ignore
const AuthContext = createContext<UseAuth>();

export enum COOKIE {
  accessToken = "at",
  refreshToken = "rt",
  auth = "oa",
}

function createOAuthSecurity() {
  const state = base64urlencode(crypto.randomBytes(5));
  const codeVerifier = base64urlencode(crypto.randomBytes(40));
  const codeChallenge = base64urlencode(crypto.createHash("sha256").update(codeVerifier).digest("hex"));
  return { state, codeVerifier, codeChallenge };
}

function AuthProvider(props: any) {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState<DecodedAccessToken | undefined>(cookieService.get(COOKIE.accessToken));
  const [, setRefreshToken] = useState<DecodedRefreshToken | undefined>(cookieService.get(COOKIE.refreshToken));

  useEffect(() => {
    if (accessToken) graphQLClient.setHeader("Authorization", "Bearer " + accessToken.token);
  }, [accessToken]);

  const handleLoginRedirect = async () => {
    const { state, codeVerifier, codeChallenge } = createOAuthSecurity();
    const redirectQuery = {
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: ["contacts.read", "contacts.write"],
      state,
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
    };
    const oauth = {
      codeVerifier,
      state,
    };
    cookieService.set(COOKIE.auth, oauth, { path: "/" });
    const redirectTo = process.env.NEXT_PUBLIC_API_URL + "/oauth2/authorize" + "?" + querystring.stringify(redirectQuery);
    await router.push(redirectTo);
  };

  const handleLogout = async () => {
    cookieService.remove(COOKIE.auth);
    cookieService.remove(COOKIE.accessToken);
    cookieService.remove(COOKIE.refreshToken);
    setAccessToken(undefined);
    setRefreshToken(undefined);
    // await client("/logout", { method: "POST" });
    await router.replace("/");
  };

  const handleCodeTokenExchange = async (code: string, incomingState: string): Promise<boolean> => {
    const oauth: any = cookieService.get(COOKIE.auth);
    const codeVerifier = oauth?.codeVerifier;
    const existingState = oauth?.state;

    if (!codeVerifier) {
      console.error("NO CODE VERIFIER");
      return false;
    }

    if (incomingState !== existingState) {
      console.error(`INVALID STATE ${incomingState} ${existingState}`);
      return false;
    }

    const body: any = {
      code,
      state: existingState,
      code_verifier: codeVerifier,
      client_id: clientId,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    };

    const url = process.env.NEXT_PUBLIC_API_URL + "/oauth2/token";

    const response = await httpClient(url, { body });

    if (response.message) {
      console.error(response.message);
      return false;
    }

    if (response.access_token) setAccessTokenCookie(response.access_token);
    if (response.refresh_token) setRefreshTokenCookie(response.refresh_token);

    cookieService.remove(COOKIE.auth);
    return true;
  };

  const setAccessTokenCookie = (token: string) => {
    const decodedJWT: DecodedJWT | any = jwt_decode(token);
    const accessToken: DecodedAccessToken = {
      token,
      userId: decodedJWT.sub,
      expiresAt: decodedJWT.exp,
      email: decodedJWT.email,
      isActive: decodedJWT.isActive,
    };
    graphQLClient.setHeader("Authorization", "Bearer " + token);
    cookieService.set(COOKIE.accessToken, accessToken, {
      path: "/",
      expires: new Date(decodedJWT.exp * 1000)
    });
    setAccessToken(accessToken);
  };

  const setRefreshTokenCookie = (token: string) => {
    const decodedJWT: DecodedJWT | any = jwt_decode(token);
    const refreshToken: DecodedRefreshToken = {
      token,
      userId: decodedJWT.user_id,
      expiresAt: decodedJWT.expire_time,
    };
    cookieService.set(COOKIE.refreshToken, refreshToken, {
      path: "/",
      expires: new Date(decodedJWT.expire_time * 1000),
    });
    setRefreshToken(refreshToken);
  };

  const isAuthenticated = () => !(Date.now() / 1000 > (accessToken?.expiresAt ?? 0));

  return <AuthContext.Provider value={{
    isAuthenticated,
    handleLogout,
    handleCodeTokenExchange,
    handleLoginRedirect,
  }} {...props} />;
}

type UseAuth = {
  isAuthenticated(): boolean;
  handleLogout(): Promise<void>;
  handleLoginRedirect(): Promise<void>;
  handleCodeTokenExchange(code: string, incomingState: string): Promise<boolean>;
}

const useAuth = () => useContext<UseAuth>(AuthContext);

export { AuthProvider, useAuth };
