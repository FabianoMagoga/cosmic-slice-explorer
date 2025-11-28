// @ts-nocheck
// src/pages/AdminFaturamento.tsx
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AdminBackButton from "@/components/AdminBackButton";
import { useNavigate } from "react-router-dom";

type Pedido = {
  id: string;
  numero: number;
  total: number;
  subtotal: number;
  descontos: number;
  taxa_entrega: number;
  forma_pagamento: string;
  modo: string; // <- aqui agora é "modo"
  criado_em: string;
};

const AdminFaturamento = () => {
  const navigate = useNavigate();
  const [diaSelecionado, setDiaSelecionado] = useState<string | null>(null);

  // ============================
  // BUSCAR PEDIDOS (últimos 90 dias)
  // ============================
  const { data: pedidos, isLoading, error } = useQuery({
    queryKey: ["faturamento_pedidos"],
    queryFn: async () => {
      const agora = new Date();
      const inicio = new Date();
      inicio.setDate(agora.getDate() - 90);

      const { data, error } = await supabase
        .from("pedidos")
        .select(
          "id, numero, total, subtotal, descontos, taxa_entrega, forma_pagamento, modo, criado_em"
        ) // <- forma_pagamento e modo
        .gte("criado_em", inicio.toISOString())
        .order("criado_em", { ascending: false });

      if (error) throw error;
      return data as Pedido[];
    },
  });

  const resumo = useMemo(() => {
    if (!pedidos || pedidos.length === 0) {
      return {
        totalGeral: 0,
        totalHoje: 0,
        total7: 0,
        total30: 0,
        ticketMedio: 0,
        porDia: [] as { dia: string; total: number; qtd: number }[],
        porForma: [] as { forma: string; total: number; qtd: number }[],
      };
    }

    const hoje = new Date();
    const hojeStr = hoje.toISOString().slice(0, 10); // yyyy-mm-dd
    const seteDias = new Date();
    seteDias.setDate(hoje.getDate() - 7);
    const trintaDias = new Date();
    trintaDias.setDate(hoje.getDate() - 30);

    let totalHoje = 0;
    let total7 = 0;
    let total30 = 0;
    let totalGeral = 0;

    const porDiaMap = new Map<string, { total: number; qtd: number }>();
    const porFormaMap = new Map<string, { total: number; qtd: number }>();

    pedidos.forEach((p) => {
      const d = new Date(p.criado_em);
      const diaKey = p.criado_em.slice(0, 10); // yyyy-mm-dd

      const total = Number(p.total || 0);
      totalGeral += total;

      if (diaKey === hojeStr) totalHoje += total;
      if (d >= seteDias) total7 += total;
      if (d >= trintaDias) total30 += total;

      const diaAtual = porDiaMap.get(diaKey) || { total: 0, qtd: 0 };
      diaAtual.total += total;
      diaAtual.qtd += 1;
      porDiaMap.set(diaKey, diaAtual);

      const formaKey = p.forma_pagamento || "—";
      const formaAtual = porFormaMap.get(formaKey) || { total: 0, qtd: 0 };
      formaAtual.total += total;
      formaAtual.qtd += 1;
      porFormaMap.set(formaKey, formaAtual);
    });

    const porDia = Array.from(porDiaMap.entries())
      .map(([dia, v]) => ({ dia, ...v }))
      .sort((a, b) => (a.dia < b.dia ? 1 : -1)); // mais recente primeiro

    const porForma = Array.from(porFormaMap.entries())
      .map(([forma, v]) => ({ forma, ...v }))
      .sort((a, b) => b.total - a.total);

    const ticketMedio =
      pedidos.length > 0 ? totalGeral / pedidos.length : 0;

    return {
      totalGeral,
      totalHoje,
      total7,
      total30,
      ticketMedio,
      porDia,
      porForma,
    };
  }, [pedidos]);

  const formatMoney = (n: number) =>
    `R$ ${Number(n || 0).toFixed(2).replace(".", ",")}`;

  const formatDiaBr = (isoDate: string) => {
    const [y, m, d] = isoDate.split("-");
    return `${d}/${m}/${y}`;
  };

  // pedidos do dia selecionado
  const pedidosDoDiaSelecionado =
    diaSelecionado && pedidos
      ? pedidos.filter((p) => p.criado_em.slice(0, 10) === diaSelecionado)
      : [];

  // ============================
  // IMPRESSÃO DO RELATÓRIO
  // ============================
  const handlePrint = () => {
    window.print();
  };

  // ============================
  // EXPORTAR CSV
  // ============================
  const handleExportCSV = () => {
    if (!pedidos || pedidos.length === 0) {
      alert("Não há pedidos para exportar.");
      return;
    }

    const header = [
      "data",
      "hora",
      "numero_pedido",
      "modo",
      "forma_pagamento",
      "subtotal",
      "descontos",
      "taxa_entrega",
      "total",
    ];

    const rows = pedidos.map((p) => {
      const d = new Date(p.criado_em);
      const data = d.toLocaleDateString("pt-BR");
      const hora = d.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });

      return [
        data,
        hora,
        p.numero,
        p.modo,
        p.forma_pagamento,
        Number(p.subtotal || 0).toFixed(2),
        Number(p.descontos || 0).toFixed(2),
        Number(p.taxa_entrega || 0).toFixed(2),
        Number(p.total || 0).toFixed(2),
      ];
    });

    const csvContent =
      header.join(";") +
      "\n" +
      rows.map((r) => r.join(";")).join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const agora = new Date();
    const nomeArquivo = `faturamento_${agora
      .toISOString()
      .slice(0, 10)}.csv`;

    a.href = url;
    a.download = nomeArquivo;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <AdminBackButton />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Faturamento</h1>

        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={handlePrint}>
            Imprimir relatório
          </Button>
          <Button onClick={handleExportCSV}>Exportar CSV</Button>
        </div>
      </div>

      {isLoading && <p>Carregando dados de faturamento...</p>}
      {error && (
        <p className="text-sm text-red-500">
          Erro ao carregar: {String(error.message || error)}
        </p>
      )}

      {/* RESUMO PRINCIPAL */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatMoney(resumo.totalHoje)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Últimos 7 dias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatMoney(resumo.total7)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Últimos 30 dias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatMoney(resumo.total30)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Ticket médio (90 dias)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatMoney(resumo.ticketMedio)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* TABELA POR DIA */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">
            Faturamento por dia (últimos 90 dias)
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
          >
            Atualizar
          </Button>
        </div>

        <Card>
          <CardContent className="py-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left py-2">Dia</th>
                  <th className="text-right py-2">Qtde pedidos</th>
                  <th className="text-right py-2">Faturamento</th>
                  <th className="text-right py-2"></th>
                </tr>
              </thead>
              <tbody>
                {resumo.porDia.map((d) => {
                  const selecionado = diaSelecionado === d.dia;
                  return (
                    <tr
                      key={d.dia}
                      className={`border-b border-slate-900 last:border-0 ${
                        selecionado ? "bg-slate-800/60" : ""
                      }`}
                    >
                      <td className="py-2">{formatDiaBr(d.dia)}</td>
                      <td className="py-2 text-right">{d.qtd}</td>
                      <td className="py-2 text-right">
                        {formatMoney(d.total)}
                      </td>
                      <td className="py-2 text-right">
                        <Button
                          size="sm"
                          variant={selecionado ? "default" : "outline"}
                          onClick={() =>
                            setDiaSelecionado(selecionado ? null : d.dia)
                          }
                        >
                          {selecionado ? "Fechar pedidos" : "Ver pedidos"}
                        </Button>
                      </td>
                    </tr>
                  );
                })}

                {resumo.porDia.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-3 text-center text-muted-foreground"
                    >
                      Nenhum pedido encontrado no período.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      {/* DETALHES: PEDIDOS DO DIA SELECIONADO */}
      {diaSelecionado && (
        <DetalhesPedidosDoDia
          diaSelecionado={diaSelecionado}
          pedidos={pedidos || []}
          formatMoney={formatMoney}
          formatDiaBr={formatDiaBr}
          navigate={navigate}
        />
      )}

      {/* Faturamento por forma de pagamento */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3">
          Faturamento por forma de pagamento (90 dias)
        </h2>

        <Card>
          <CardContent className="py-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left py-2">Forma</th>
                  <th className="text-right py-2">Qtde pedidos</th>
                  <th className="text-right py-2">Faturamento</th>
                </tr>
              </thead>
              <tbody>
                {resumo.porForma.map((f) => (
                  <tr
                    key={f.forma}
                    className="border-b border-slate-900 last:border-0"
                  >
                    <td className="py-2">{f.forma}</td>
                    <td className="py-2 text-right">{f.qtd}</td>
                    <td className="py-2 text-right">
                      {formatMoney(f.total)}
                    </td>
                  </tr>
                ))}

                {resumo.porForma.length === 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="py-3 text-center text-muted-foreground"
                    >
                      Nenhum dado de faturamento.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const DetalhesPedidosDoDia = ({
  diaSelecionado,
  pedidos,
  formatMoney,
  formatDiaBr,
  navigate,
}: any) => {
  const pedidosDoDiaSelecionado = pedidos.filter(
    (p: Pedido) => p.criado_em.slice(0, 10) === diaSelecionado
  );

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold">
          Pedidos do dia {formatDiaBr(diaSelecionado)}
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            navigate(`/admin/pedidos?dia=${encodeURIComponent(diaSelecionado)}`)
          }
        >
          Abrir na tela de Pedidos
        </Button>
      </div>

      <Card>
        <CardContent className="py-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left py-2">Número</th>
                <th className="text-left py-2">Modo</th>
                <th className="text-left py-2">Forma</th>
                <th className="text-right py-2">Subtotal</th>
                <th className="text-right py-2">Descontos</th>
                <th className="text-right py-2">Taxa entrega</th>
                <th className="text-right py-2">Total</th>
                <th className="text-right py-2">Hora</th>
              </tr>
            </thead>
            <tbody>
              {pedidosDoDiaSelecionado.map((p: Pedido) => {
                const hora = new Date(p.criado_em).toLocaleTimeString(
                  "pt-BR",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                );
                return (
                  <tr
                    key={p.id}
                    className="border-b border-slate-900 last:border-0"
                  >
                    <td className="py-2">#{p.numero}</td>
                    <td className="py-2">{p.modo}</td>
                    <td className="py-2">{p.forma_pagamento}</td>
                    <td className="py-2 text-right">
                      {formatMoney(p.subtotal)}
                    </td>
                    <td className="py-2 text-right">
                      {formatMoney(p.descontos)}
                    </td>
                    <td className="py-2 text-right">
                      {formatMoney(p.taxa_entrega)}
                    </td>
                    <td className="py-2 text-right">
                      {formatMoney(p.total)}
                    </td>
                    <td className="py-2 text-right">{hora}</td>
                  </tr>
                );
              })}

              {pedidosDoDiaSelecionado.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="py-3 text-center text-muted-foreground"
                  >
                    Nenhum pedido para esse dia.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminFaturamento;
