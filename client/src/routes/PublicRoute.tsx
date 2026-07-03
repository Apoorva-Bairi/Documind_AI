import { Navigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAppSelector((state) => state.auth);

  if (token) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}

export default PublicRoute;