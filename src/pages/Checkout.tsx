// src/pages/Checkout.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

const PIZZARIA_ENDERECO = "Rua Exemplo, 123 - Centro, Jundiaí - SP";
const PIZZARIA_NOME = "Planet Pizza";

const Checkout = () => {
  const { items, total, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [tipoPedido, setTipoPedido] = useState<"entrega" | "retirada">(
    "entrega"
  );
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [horarioDesejado, setHorarioDesejado] = useState("");
  const [formaPagamento, setFormaPagamento] = useState<
    "dinheiro" | "cartao" | "pix"
  >("dinheiro");
  const [loading, setLoading] = useState(false);

  // taxa fixa de exemplo
  const taxaEntrega = tipoPedido === "entrega" ? 8.9 : 0;
  const totalGeral = total + taxaEntrega;

  const validar = () => {
    if (!nome.trim()) {
      toast({
        variant: "destructive",
        title: "Nome obrigatório",
        description: "Informe seu nome para continuar.",
      });
      return false;
    }

    if (!telefone.trim()) {
      toast({
        variant: "destructive",
        title: "Telefone obrigatório",
        description: "Informe um telefone para contato.",
      });
      return false;
    }

    if (tipoPedido === "entrega" && !endereco.trim()) {
      toast({
        variant: "destructive",
        title: "Endereço obrigatório",
        description: "Preencha o endereço para entrega.",
      });
      return false;
    }

    if (items.length === 0) {
      toast({
        variant: "destructive",
        title: "Carrinho vazio",
        description: "Adicione pelo menos um item antes de finalizar.",
      });
      return false;
    }

    return true;
  };

  const handleFinalizar = async () => {
    if (!validar()) return;

    setLoading(true);

    try {
      // 1) Salvar no Supabase
      const pedidoPayload = {
        tipo_pedido: tipoPedido,
        nome_cliente: nome,
        telefone,
        endereco: tipoPedido === "entrega" ? endereco : null,
        observacoes: observacoes || null,
        horario_desejado: horarioDesejado || null,
        taxa_entrega: taxaEntrega,
        total: totalGeral,
        forma_pagamento: formaPagamento, // coluna text no banco
        status: "novo", // coluna text no banco
        itens: items.map((item) => ({
          produto_id: item.id,
          nome: item.nome,
          quantidade: item.quantidade,
          preco_unitario: item.preco,
          subtotal: item.preco * item.quantidade,
        })),
      };

      const { error } = await supabase.from("pedidos").insert(pedidoPayload);

      if (error) {
        console.error(error);
        toast({
          variant: "destructive",
          title: "Erro ao finalizar pedido",
          description: error.message,
        });
        setLoading(false);
        return;
      }

      // 2) Montar mensagem para WhatsApp
      const numeroWhatsApp = import.meta.env.VITE_WHATSAPP_NUMBER as
        | string
        | undefined;

      const linhasItens = items
        .map(
          (item) =>
            `• ${item.nome}  x${item.quantidade}  (${formatCurrency(
              item.preco * item.quantidade
            )})`
        )
        .join("\n");

      const formaPagamentoTexto =
        formaPagamento === "dinheiro"
          ? "Dinheiro"
          : formaPagamento === "cartao"
          ? "Cartão"
          : "Pix";

      const msg = [
        `*${PIZZARIA_NOME}* - Novo pedido *${tipoPedido.toUpperCase()}*`,
        "",
        `*Cliente*: ${nome}`,
        `*Telefone*: ${telefone}`,
        tipoPedido === "entrega"
          ? `*Endereço*: ${endereco}`
          : `*Retirada no local*`,
        horarioDesejado
          ? `*Horário desejado*: ${horarioDesejado}`
          : "*Horário*: o quanto antes",
        `*Pagamento*: ${formaPagamentoTexto}`,
        "",
        "*Itens:*",
        linhasItens,
        "",
        `*Total produtos*: ${formatCurrency(total)}`,
        `*Taxa entrega*: ${formatCurrency(taxaEntrega)}`,
        `*Total geral*: ${formatCurrency(totalGeral)}`,
        "",
        observacoes ? `*Obs*: ${observacoes}` : "",
      ]
        .filter(Boolean)
        .join("\n");

      if (numeroWhatsApp) {
        const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(
          msg
        )}`;
        window.open(url, "_blank");
      }

      // 👇 salvar resumo do pedido para a tela de sucesso
      localStorage.setItem(
        "planetpizza_last_order",
        JSON.stringify({
          nome,
          total: totalGeral,
          forma_pagamento: formaPagamento,
        })
      );

      // 3) Limpar carrinho e ir para tela de sucesso
      clearCart();
      navigate("/pedido-sucesso");
    } catch (err: any) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Erro inesperado",
        description: "Tente novamente em instantes.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 pb-16">
      <div className="max-w-5xl mx-auto px-4 pt-10">
        {/* Título */}
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            Checkout
          </p>
          <h1 className="mt-2 text-3xl md:text-4xl font-bold">
            Finalizar pedido
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Informe seus dados e revise seu pedido.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-[2fr,1.5fr]">
          {/* COLUNA ESQUERDA */}
          <div className="bg-slate-900/70 rounded-2xl border border-slate-800 p-6 space-y-5">
            <h2 className="text-xl font-bold mb-2">
              {tipoPedido === "entrega"
                ? "Dados para entrega"
                : "Dados para retirada"}
            </h2>

            {/* Tipo do pedido */}
            <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-4 space-y-2">
              <p className="text-sm font-medium mb-2">
                Como deseja receber?
              </p>
              <div className="flex gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={() => setTipoPedido("entrega")}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
                    tipoPedido === "entrega"
                      ? "bg-amber-400 text-slate-950"
                      : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                  }`}
                >
                  Entrega
                </button>
                <button
                  type="button"
                  onClick={() => setTipoPedido("retirada")}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition ${
                    tipoPedido === "retirada"
                      ? "bg-amber-400 text-slate-950"
                      : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                  }`}
                >
                  Retirada no local
                </button>
              </div>

              {tipoPedido === "retirada" && (
                <p className="mt-3 text-xs text-slate-400">
                  Retirada em:{" "}
                  <span className="font-semibold">
                    {PIZZARIA_ENDERECO}
                  </span>
                </p>
              )}
            </div>

            {/* Forma de pagamento */}
            <div className="bg-slate-900/80 rounded-xl border border-slate-800 p-4 space-y-2">
              <p className="text-sm font-medium mb-2">
                Forma de pagamento
              </p>
              <div className="flex gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={() => setFormaPagamento("dinheiro")}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                    formaPagamento === "dinheiro"
                      ? "bg-amber-400 text-slate-950"
                      : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                  }`}
                >
                  Dinheiro
                </button>
                <button
                  type="button"
                  onClick={() => setFormaPagamento("cartao")}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                    formaPagamento === "cartao"
                      ? "bg-amber-400 text-slate-950"
                      : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                  }`}
                >
                  Cartão
                </button>
                <button
                  type="button"
                  onClick={() => setFormaPagamento("pix")}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                    formaPagamento === "pix"
                      ? "bg-amber-400 text-slate-950"
                      : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                  }`}
                >
                  Pix
                </button>
              </div>
            </div>

            {/* Nome */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Nome</label>
              <input
                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/70"
                placeholder="Seu nome completo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>

            {/* Telefone */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Telefone</label>
              <input
                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/70"
                placeholder="(11) 99999-9999"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
              />
            </div>

            {/* Endereço – só para entrega */}
            {tipoPedido === "entrega" && (
              <div className="space-y-1">
                <label className="text-sm font-medium">Endereço</label>
                <input
                  className="w-full rounded-lg bg-slate-950 border border-slate-700 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/70"
                  placeholder="Rua, número, bairro, cidade"
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                />
              </div>
            )}

            {/* Horário desejado */}
            <div className="space-y-1">
              <label className="text-sm font-medium">
                Horário desejado (opcional)
              </label>
              <input
                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/70"
                placeholder="Ex: 20h00, assim que possível..."
                value={horarioDesejado}
                onChange={(e) => setHorarioDesejado(e.target.value)}
              />
            </div>

            {/* Observações */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Observações</label>
              <textarea
                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-4 py-2 text-sm h-24 resize-none focus:outline-none focus:ring-2 focus:ring-amber-400/70"
                placeholder="Ex: Retirar cebola, portão preto..."
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
              />
            </div>
          </div>

          {/* COLUNA DIREITA – Resumo */}
          <div className="bg-slate-900/70 rounded-2xl border border-slate-800 p-6 flex flex-col">
            <h2 className="text-xl font-bold mb-4">Resumo do pedido</h2>

            <div className="space-y-3 flex-1 overflow-y-auto max-h-[340px] pr-1">
              {items.length === 0 ? (
                <p className="text-sm text-slate-400">
                  Seu carrinho está vazio.
                </p>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-4 text-sm"
                  >
                    <div>
                      <p className="font-semibold">{item.nome}</p>
                      {item.descricao && (
                        <p className="text-xs text-slate-400">
                          {item.descricao}
                        </p>
                      )}
                      <p className="text-xs text-slate-400 mt-1">
                        Qtd: {item.quantidade}
                      </p>
                    </div>
                    <p className="font-semibold">
                      {formatCurrency(item.preco * item.quantidade)}
                    </p>
                  </div>
                ))
              )}
            </div>

            <hr className="my-4 border-slate-800" />

            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-300">Subtotal</span>
                <span className="font-semibold">
                  {formatCurrency(total)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">
                  Taxa de entrega
                  {tipoPedido === "retirada" && " (não aplicada)"}
                </span>
                <span className="font-semibold">
                  {formatCurrency(taxaEntrega)}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4 text-lg font-bold">
              <span>Total</span>
              <span className="text-amber-400">
                {formatCurrency(totalGeral)}
              </span>
            </div>

            <button
              disabled={loading}
              onClick={handleFinalizar}
              className="mt-6 w-full rounded-full bg-gradient-to-r from-amber-400 to-pink-500 py-3 text-sm font-semibold text-slate-950 hover:brightness-105 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {loading ? "Enviando pedido..." : "Confirmar pedido"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
