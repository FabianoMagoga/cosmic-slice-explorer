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
      const { data, error } = await supabase
        .from('funcionarios')
        .select('*')
        .eq('usuario', usuario)
        .eq('senha', senha)
        .eq('ativo', true)
        .single();

      if (error || !data) {
        return { success: false, error: 'Usuário ou senha inválidos' };
      }

      const func: Funcionario = {
        id: data.id,
        usuario: data.usuario,
        nome: data.nome,
        papel: data.papel as 'ADMIN' | 'ATENDENTE',
        ativo: data.ativo
      };

      setFuncionario(func);
      localStorage.setItem('funcionario', JSON.stringify(func));
      return { success: true };
    } catch (error) {
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