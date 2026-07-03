import { Navigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAppSelector((state) => state.auth);

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;