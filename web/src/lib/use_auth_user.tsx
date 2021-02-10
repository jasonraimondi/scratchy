import { createContext, useContext } from "react";

// @ts-ignore
const AuthUserContext = createContext<UseAuth>();

function AuthUserProvider(props: any) {
  return <AuthUserContext.Provider value={{}} {...props} />;
}

type UseAuth = {
  bearer?: string;
};

const useAuthUser = () => useContext<UseAuth>(AuthUserContext);

export { AuthUserProvider, useAuthUser };
