import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users, Package, ShoppingBag, Tag, FileText, Download,
  BarChart, TrendingUp, LogOut, UserPlus, Pizza, Gift
} from "lucide-react";

const AdminPanel = () => {
  const { funcionario, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!funcionario) {
      navigate("/admin/login");
    }
  }, [funcionario, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const adminFeatures = [
    { icon: Users, title: "Cadastrar Cliente", desc: "Gerenciar clientes", path: "/admin/clientes" },
    { icon: UserPlus, title: "Cadastrar Funcionário", desc: "Gerenciar funcionários", path: "/admin/funcionarios", adminOnly: true },
    { icon: Package, title: "Cadastrar Produtos", desc: "Gerenciar produtos", path: "/admin/produtos" },
    { icon: Pizza, title: "Cadastrar Combos", desc: "Criar combos promocionais", path: "/admin/combos" },
    { icon: Tag, title: "Cadastrar Promoções", desc: "Gerenciar promoções", path: "/admin/promocoes" },
    { icon: ShoppingBag, title: "Novo Pedido", desc: "Registrar pedido no balcão", path: "/admin/novo-pedido" },
    { icon: FileText, title: "Cupom Fiscal", desc: "Extrair cupom fiscal", path: "/admin/cupom-fiscal" },
    { icon: Download, title: "Exportar Dados", desc: "CSV/TXT de relatórios", path: "/admin/exportar" },
    { icon: BarChart, title: "Relatório de Vendas", desc: "Análise de vendas", path: "/admin/relatorio-vendas" },
    { icon: TrendingUp, title: "Relatório de Produtos", desc: "Produtos mais vendidos", path: "/admin/relatorio-produtos" },
    { icon: Gift, title: "Relatório de Promoções", desc: "Efetividade das promoções", path: "/admin/relatorio-promocoes" },
  ];

  const filteredFeatures = isAdmin 
    ? adminFeatures 
    : adminFeatures.filter(f => !f.adminOnly);

  if (!funcionario) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Painel Administrativo
            </h1>
            <p className="text-muted-foreground mt-2">
              Bem-vindo, {funcionario.nome} ({funcionario.papel})
            </p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group"
                onClick={() => navigate(feature.path)}
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                  <CardDescription>{feature.desc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="w-full">
                    Acessar
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-8">
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="w-full md:w-auto"
          >
            Voltar ao Site
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;