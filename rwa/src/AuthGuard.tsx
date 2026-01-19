import { useContext, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { LoginContext } from "./LoginContextProvider";

type AuthGuardProps = {
  children: ReactNode;
};

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isLoggedIn } = useContext(LoginContext)!; // Non-null assertion

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
