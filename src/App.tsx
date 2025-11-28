// src/App.tsx
import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";

// Páginas públicas
import Index from "@/pages/Index";
import Menu from "@/pages/Menu";
import Combos from "@/pages/Combos";
import Promocoes from "@/pages/Promocoes";
import Sobre from "@/pages/Sobre";
import Checkout from "@/pages/Checkout";
import PedidoSucesso from "@/pages/pedido-sucesso";

// Admin
import AdminLogin from "@/pages/AdminLogin";
import AdminPanel from "@/pages/AdminPanel";
import AdminProdutos from "@/pages/AdminProdutos";
import AdminPedidos from "@/pages/AdminPedidos";
import AdminConfig from "@/pages/AdminConfig";

// ✅ Novas páginas admin
import AdminCombos from "@/pages/AdminCombos";
import AdminCupons from "@/pages/AdminCupons";
import AdminClientes from "@/pages/AdminClientes";
import AdminFuncionarios from "@/pages/AdminFuncionarios";
import AdminFaturamento from "@/pages/AdminFaturamento";

// Rota protegida
import ProtectedRoute from "@/components/ProtectedRoute";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <CartProvider>
            <Routes>
              {/* ROTAS PÚBLICAS */}
              <Route path="/" element={<Index />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/combos" element={<Combos />} />
              <Route path="/promocoes" element={<Promocoes />} />
              <Route path="/sobre" element={<Sobre />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/pedido-sucesso" element={<PedidoSucesso />} />

              {/* LOGIN ADMIN */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* ADMIN – PAINEL PRINCIPAL */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />

              {/* ADMIN – MÓDULOS */}
              <Route
                path="/admin/produtos"
                element={
                  <ProtectedRoute>
                    <AdminProdutos />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/pedidos"
                element={
                  <ProtectedRoute>
                    <AdminPedidos />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/config"
                element={
                  <ProtectedRoute>
                    <AdminConfig />
                  </ProtectedRoute>
                }
              />

              {/* ✅ NOVOS MÓDULOS ADMIN */}
              <Route
                path="/admin/combos"
                element={
                  <ProtectedRoute>
                    <AdminCombos />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/cupons"
                element={
                  <ProtectedRoute>
                    <AdminCupons />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/clientes"
                element={
                  <ProtectedRoute>
                    <AdminClientes />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/funcionarios"
                element={
                  <ProtectedRoute>
                    <AdminFuncionarios />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/faturamento"
                element={
                  <ProtectedRoute>
                    <AdminFaturamento />
                  </ProtectedRoute>
                }
              />
            </Routes>

            <Toaster />
            <Sonner />
          </CartProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
