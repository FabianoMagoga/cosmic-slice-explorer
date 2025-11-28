// src/pages/AdminLogin.tsx
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, loading } = useAuth(); // 👈 vindo do AuthProvider

  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!usuario.trim() || !senha.trim()) {
      toast({
        title: "Preencha os campos",
        description: "Informe usuário e senha para continuar.",
        variant: "destructive",
      });
      return;
    }

    try {
      // 👇 aqui usamos a função login do contexto
      const result = await login(usuario.trim(), senha.trim());

      // se o seu login NÃO retornar boolean, pode remover esse if e só navegar
      if (result === false) {
        toast({
          title: "Acesso negado",
          description: "Usuário ou senha inválidos.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Bem-vindo!",
        description: "Redirecionando para o painel administrativo...",
      });

      navigate("/admin");
    } catch (err: any) {
      toast({
        title: "Erro ao entrar",
        description:
          err?.message || "Não foi possível fazer login. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-slate-900/80 border-slate-800 backdrop-blur-sm shadow-xl p-4">

        {/* 🔙 Botão para voltar ao site */}
        <div className="flex justify-start mb-2">
          <Button
            type="button"
            variant="ghost"
            className="text-slate-300 hover:text-white px-0"
            onClick={() => navigate("/")}
          >
            ← Voltar para o site
          </Button>
        </div>

        <CardHeader className="text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
            Planet Pizza
          </p>
          <CardTitle className="text-2xl font-bold mt-1">
            Acesso Administrativo
          </CardTitle>
          <p className="text-xs text-slate-400 mt-1">
            Use suas credenciais de funcionário para acessar o painel.
          </p>
        </CardHeader>

        <CardContent>
          <form
            className="space-y-4"
            autoComplete="off" // 👈 desabilita autocomplete no form
            onSubmit={handleSubmit}
          >
            {/* Usuário */}
            <div className="space-y-2">
              <Label htmlFor="usuario">Usuário</Label>
              <Input
                id="usuario"
                type="email"
                autoComplete="off"       // 👈 evita preencher automaticamente
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                placeholder="admin@planetpizza.com"
              />
            </div>

            {/* Senha */}
            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                type="password"
                autoComplete="new-password" // 👈 truque pra não reaproveitar senha salva
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold"
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar no painel"}
            </Button>

            <p className="text-[10px] text-slate-500 text-center mt-2">
              As ações são monitoradas. Use apenas credenciais autorizadas.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
