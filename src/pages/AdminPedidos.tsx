// @ts-nocheck
// src/pages/AdminPedidos.tsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AdminBackButton from "@/components/AdminBackButton";

const AdminPedidos = () => {
  const [filtro, setFiltro] = useState("");
  const [pedidoSelecionado, setPedidoSelecionado] = useState<any | null>(null);

  // ============================
  // LISTAR PEDIDOS
  // ============================
  const {
    data: pedidos,
    isLoading: loadingPedidos,
    error: errorPedidos,
  } = useQuery({
    queryKey: ["pedidos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pedidos")
        .select("*")
        .order("criado_em", { ascending: false });

      if (error) {
        console.error(error);
        throw error;
      }
      return data;
    },
  });

  // ============================
  // ITENS DO PEDIDO SELECIONADO
  // ============================
  const {
    data: itens,
    isLoading: loadingItens,
    error: errorItens,
  } = useQuery({
    queryKey: ["pedido_itens", pedidoSelecionado?.id],
    enabled: !!pedidoSelecionado,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pedido_itens")
        .select("*")
        .eq("pedido_id", pedidoSelecionado.id);

      if (error) {
        console.error(error);
        throw error;
      }
      return data;
    },
  });

  const listaFiltrada =
    pedidos?.filter((p: any) => {
      const t = filtro.trim().toLowerCase();
      if (!t) return true;

      const num = String(p.numero ?? "");
      const forma = (p.forma ?? "").toLowerCase();
      const modo = (p.modo ?? "").toLowerCase();

      return (
        num.includes(t) ||
        forma.includes(t) ||
        modo.includes(t)
      );
    }) ?? [];

  const formatData = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatMoney = (n: number) =>
    `R$ ${Number(n || 0).toFixed(2).replace(".", ",")}`;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <AdminBackButton />

      <h1 className="text-3xl font-bold mb-6">Pedidos</h1>

      {/* FILTRO */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <p className="text-sm text-muted-foreground">
          Aqui aparecem todos os pedidos salvos na tabela <strong>pedidos</strong>.
        </p>

        <Input
          placeholder="Filtrar por número, forma de pagamento ou modo..."
          className="max-w-md"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
      </div>

      {loadingPedidos && <p>Carregando pedidos...</p>}
      {errorPedidos && (
        <p className="text-red-500 text-sm">
          Erro ao carregar pedidos: {String(errorPedidos.message || errorPedidos)}
        </p>
      )}

      {/* LISTA DE PEDIDOS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {listaFiltrada.map((p: any) => (
          <Card
            key={p.id}
            className={`cursor-pointer transition ${
              pedidoSelecionado?.id === p.id
                ? "border-primary shadow-lg"
                : "hover:border-primary/60"
            }`}
            onClick={() => setPedidoSelecionado(p)}
          >
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Pedido #{p.numero ?? "—"}</span>
                <span className="text-sm font-normal text-muted-foreground">
                  {formatData(p.criado_em)}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <p className="text-sm">
                <span className="font-semibold">Modo:</span>{" "}
                {p.modo || "-"}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Forma:</span>{" "}
                {p.forma || "-"}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Subtotal:</span>{" "}
                {formatMoney(p.subtotal)}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Descontos:</span>{" "}
                {formatMoney(p.descontos)}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Taxa entrega:</span>{" "}
                {formatMoney(p.taxa_entrega)}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Total:</span>{" "}
                {formatMoney(p.total)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {!loadingPedidos && listaFiltrada.length === 0 && (
        <p className="mt-4 text-sm text-muted-foreground">
          Nenhum pedido encontrado. Verifique se o Checkout está salvando na tabela
          <strong> pedidos</strong>.
        </p>
      )}

      {/* DETALHES DO PEDIDO */}
      {pedidoSelecionado && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">
            Detalhes do Pedido #{pedidoSelecionado.numero}
          </h2>

          {loadingItens && <p>Carregando itens...</p>}
          {errorItens && (
            <p className="text-red-500 text-sm">
              Erro ao carregar itens: {String(errorItens.message || errorItens)}
            </p>
          )}

          {itens && itens.length > 0 && (
            <Card>
              <CardContent className="py-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left py-2">Produto</th>
                        <th className="text-left py-2">Categoria</th>
                        <th className="text-right py-2">Qtd</th>
                        <th className="text-right py-2">Unitário</th>
                        <th className="text-right py-2">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {itens.map((it: any) => (
                        <tr key={it.id} className="border-b border-slate-800 last:border-0">
                          <td className="py-2">{it.nome}</td>
                          <td className="py-2">{it.categoria}</td>
                          <td className="py-2 text-right">{it.qtd}</td>
                          <td className="py-2 text-right">
                            {formatMoney(it.preco)}
                          </td>
                          <td className="py-2 text-right">
                            {formatMoney(it.preco * it.qtd)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {itens && itens.length === 0 && !loadingItens && (
            <p className="text-sm text-muted-foreground">
              Nenhum item encontrado para este pedido.
            </p>
          )}

          <Button
            className="mt-4"
            variant="outline"
            onClick={() => setPedidoSelecionado(null)}
          >
            Fechar detalhes
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdminPedidos;
