import { useState, createContext, useContext, ReactNode } from "react";

interface userType {
  name: string;
  age: number;
  password: string;
  group: number;
  is_admin: boolean;
}

interface childrenType {
  children: ReactNode;
}

interface loginContextType {
  user: null | userType;
  setUser: (user: userType) => void;
}

const LoginContext = createContext<loginContextType | undefined>(undefined);

function useLoginContext() {
  const context = useContext(LoginContext);

  if (context === undefined) {
    throw new Error("Invalid Login Context Undefined.");
  }
  return context;
}

function LoginProvider({ children }: childrenType) {
  const [user, setUser] = useState<null | userType>(null);
  false;

  const value: loginContextType = { user, setUser };

  return (
    <LoginContext.Provider value={value}>{children}</LoginContext.Provider>
  );
}

export default useLoginContext;
export { LoginProvider };
