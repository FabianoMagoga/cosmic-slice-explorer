// src/contexts/AuthContext.tsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export type Funcionario = {
  id: string;
  usuario: string;
  nome: string;
  cargo?: string;
  criado_em?: string;
};

type AuthContextType = {
  user: Funcionario | null;
  isAdmin: boolean;
  loading: boolean;
  login: (funcionario: Funcionario, isAdmin?: boolean) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

const STORAGE_USER_KEY = "planetpizza_admin_user";
const STORAGE_ADMIN_FLAG_KEY = "planetpizza_is_admin";

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<Funcionario | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  // Carrega sessão do localStorage quando o app inicia
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_USER_KEY);
      const savedAdminFlag = localStorage.getItem(STORAGE_ADMIN_FLAG_KEY);

      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }

      if (savedAdminFlag) {
        setIsAdmin(savedAdminFlag === "true");
      }
    } catch (err) {
      console.error("Erro ao carregar sessão:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Login chamado pelo AdminLogin.tsx
  const login = (funcionario: Funcionario, adminFlag: boolean = true) => {
    setUser(funcionario);
    setIsAdmin(adminFlag);

    try {
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(funcionario));
      localStorage.setItem(STORAGE_ADMIN_FLAG_KEY, String(adminFlag));
    } catch (err) {
      console.error("Erro ao salvar sessão:", err);
    }
  };

  // Logout usado no AdminPanel e onde mais precisar
  const logout = () => {
    setUser(null);
    setIsAdmin(false);

    try {
      localStorage.removeItem(STORAGE_USER_KEY);
      localStorage.removeItem(STORAGE_ADMIN_FLAG_KEY);
    } catch (err) {
      console.error("Erro ao limpar sessão:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hookzinho para usar no app inteiro
export const useAuth = () => {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  }

  return ctx;
};
