// src/pages/pedido-sucesso.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

type LastOrder = {
  nome: string;
  total: number;
  forma_pagamento: string;
};

const PedidoSucesso = () => {
  const navigate = useNavigate();
  const [lastOrder, setLastOrder] = useState<LastOrder | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("planetpizza_last_order");
      if (saved) {
        setLastOrder(JSON.parse(saved));
      }
    } catch {
      // se der erro, segue com null mesmo
    }
  }, []);

  const nomeCliente = lastOrder?.nome?.trim() || "Cliente";

  const total =
    typeof lastOrder?.total === "number" ? lastOrder.total : 0;

  const formaPagamentoRaw = lastOrder?.forma_pagamento;

  const formaPagamentoLabel = (() => {
    switch (formaPagamentoRaw) {
      case "dinheiro":
        return "Dinheiro";
      case "cartao":
        return "Cartão";
      case "pix":
        return "Pix";
      default:
        return "Não informado";
    }
  })();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-4">
      <div className="max-w-xl w-full text-center bg-slate-900/80 border border-slate-800 rounded-3xl px-6 py-10 space-y-6">
        {/* Ícone de sucesso */}
        <div className="flex items-center justify-center">
          <div className="h-14 w-14 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/40">
            <span className="text-2xl text-emerald-400">✔</span>
          </div>
        </div>

        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Pedido realizado com sucesso!
          </h1>
          <p className="text-sm md:text-base text-slate-300">
            Obrigado,{" "}
            <span className="font-semibold">{nomeCliente}</span>! Seu
            pedido já entrou na fila do nosso forno cósmico.
          </p>
        </div>

        {/* Resumo rápido */}
        <div className="space-y-1 text-sm md:text-base">
          <p className="text-slate-300">
            Valor total:{" "}
            <span className="font-semibold text-amber-400">
              {formatCurrency(total)}
            </span>
          </p>
          <p className="text-slate-300">
            Forma de pagamento:{" "}
            <span className="font-semibold">
              {formaPagamentoLabel}
            </span>
          </p>
        </div>

        {/* Botões */}
        <div className="space-y-3 pt-4">
          <button
            onClick={() => navigate("/menu")}
            className="w-full rounded-full bg-amber-400 text-slate-950 font-semibold py-3 text-sm hover:bg-amber-300 transition"
          >
            Fazer outro pedido
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full rounded-full border border-slate-700 text-slate-200 py-3 text-sm hover:bg-slate-800 transition"
          >
            Voltar para a página inicial
          </button>
        </div>
      </div>
    </div>
  );
};

export default PedidoSucesso;
