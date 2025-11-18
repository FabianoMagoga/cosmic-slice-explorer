import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

type Funcionario = {
  id: string;
  usuario: string;
  nome: string;
  papel: 'ADMIN' | 'ATENDENTE';
  ativo: boolean;
};

type AuthContextType = {
  funcionario: Funcionario | null;
  login: (usuario: string, senha: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [funcionario, setFuncionario] = useState<Funcionario | null>(null);

  useEffect(() => {
    // Verificar se há funcionário logado no localStorage
    const stored = localStorage.getItem('funcionario');
    if (stored) {
      try {
        setFuncionario(JSON.parse(stored));
      } catch (e) {
        localStorage.removeItem('funcionario');
      }
    }
  }, []);

  const login = async (usuario: string, senha: string) => {
    try {
      // Usar Edge Function para login seguro com bcrypt
      const { data: { session } } = await supabase.auth.getSession();
      const { data, error } = await supabase.functions.invoke('admin-auth', {
        body: { action: 'login', usuario, senha }
      });

      if (error || !data?.success) {
        return { success: false, error: data?.error || 'Usuário ou senha inválidos' };
      }

      const func: Funcionario = {
        id: data.funcionario.id,
        usuario: data.funcionario.usuario,
        nome: data.funcionario.nome,
        papel: data.funcionario.papel as 'ADMIN' | 'ATENDENTE',
        ativo: data.funcionario.ativo
      };

      setFuncionario(func);
      localStorage.setItem('funcionario', JSON.stringify(func));
      return { success: true };
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, error: 'Erro ao fazer login' };
    }
  };

  const logout = () => {
    setFuncionario(null);
    localStorage.removeItem('funcionario');
  };

  const isAdmin = funcionario?.papel === 'ADMIN';

  return (
    <AuthContext.Provider value={{ funcionario, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};