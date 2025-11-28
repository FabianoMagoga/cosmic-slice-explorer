// src/pages/AdminPanel.tsx
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  Pizza,
  ShoppingBag,
  Gift,
  Users,
  UserCog,
  Settings,
  Receipt,
  PackageSearch,
  LogOut,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const AdminPanel = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [loggingOut, setLoggingOut] = useState(false);

  const items = [
    {
      title: "Produtos",
      description: "Gerencie pizzas, bebidas e outros itens do cardápio.",
      icon: Pizza,
      to: "/admin/produtos",
    },
    {
      title: "Combos",
      description: "Monte e edite combos promocionais.",
      icon: ShoppingBag,
      to: "/admin/combos",
    },
    {
      title: "Cupons",
      description: "Crie cupons de desconto para campanhas.",
      icon: Gift,
      to: "/admin/cupons",
    },
    {
      title: "Clientes",
      description: "Veja histórico e dados dos clientes.",
      icon: Users,
      to: "/admin/clientes",
    },
    {
      title: "Funcionários",
      description: "Gerencie cadastros e acessos de funcionários.",
      icon: UserCog,
      to: "/admin/funcionarios",
    },
    {
      title: "Pedidos",
      description: "Acompanhe os pedidos em tempo real.",
      icon: PackageSearch,
      to: "/admin/pedidos",
    },
    {
      title: "Faturamento",
      description: "Relatórios de vendas, ticket médio e muito mais.",
      icon: Receipt,
      to: "/admin/faturamento",
    },
    {
      title: "Configurações",
      description: "Dados da pizzaria, taxas, formas de pagamento.",
      icon: Settings,
      to: "/admin/config",
    },
  ];

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logout();
      toast({
        title: "Sessão encerrada",
        description: "Você saiu do painel administrativo.",
      });
      navigate("/admin/login");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950/90 text-slate-50">
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between bg-slate-950/80 backdrop-blur">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Painel Administrativo
          </p>
          <h1 className="text-xl font-semibold">Planet Pizza • Sistema Solar</h1>
          {user && (
            <p className="text-xs text-slate-400 mt-1">
              Logado como <span className="font-medium">{user.email}</span>
            </p>
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          disabled={loggingOut}
        >
          <LogOut className="w-4 h-4 mr-2" />
          {loggingOut ? "Saindo..." : "Sair"}
        </Button>
      </header>

      <main className="px-6 py-8 max-w-6xl mx-auto grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Card
              key={item.title}
              className="bg-slate-900/80 border-slate-800 hover:border-primary/70 cursor-pointer transition-all hover:shadow-lg"
              onClick={() => navigate(item.to)}
            >
              <CardHeader className="flex flex-row items-center gap-3 pb-3">
                <div className="p-2 rounded-full bg-slate-800">
                  <Icon className="w-5 h-5" />
                </div>
                <CardTitle className="text-base">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-400">{item.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </main>
    </div>
  );
};

export default AdminPanel;
