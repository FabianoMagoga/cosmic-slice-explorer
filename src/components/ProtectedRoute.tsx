import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Enquanto carrega
  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-white">
        Carregando...
      </div>
    );
  }

  // Se não estiver logado → volta para /admin/login
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
