import { createContext, useState,type ReactNode} from "react";

type LoginContextType = {
  isLoggedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
};

export const LoginContext = createContext<LoginContextType>({
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
});

type Props = {
  children: ReactNode;
};

export default function LoginContextProvider({ children }: Props) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    Boolean(localStorage.getItem("token"))
  );

  function login(token: string) {
    localStorage.setItem("token", token);
    setIsLoggedIn(true);
  }

  function logout() {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  }

  return (
    <LoginContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </LoginContext.Provider>
  );
}
