import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/app/lib/use_auth";
import { meFetcher } from "@/app/api/user";

// @ts-ignore
const UserContext = createContext<UseCurrentUser>({});

function CurrentUserProvider(props: any) {
  const { accessTokenDecoded, isAuthenticated } = useAuth();
  const [user, setUser] = useState<any>();

  async function fetchMe() {
    if (isAuthenticated) {
      const {
        me: { id, ...me },
      } = await meFetcher();
      setUser(me);
    }
  }

  useEffect(() => void fetchMe(), [isAuthenticated]);

  return (
    <UserContext.Provider
      value={{
        userId: accessTokenDecoded?.userId,
        email: accessTokenDecoded?.email,
        ...user,
      }}
      {...props}
    />
  );
}

type UseCurrentUser = {
  userId?: string;
  email?: string;
};

const useCurrentUser = () => useContext<UseCurrentUser>(UserContext);

export { CurrentUserProvider, useCurrentUser };
