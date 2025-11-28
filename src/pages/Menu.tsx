
// src/pages/Menu.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";

import ProductCard from "@/components/ProductCard";

type Categoria =
  | "Pizza Salgadas"
  | "Pizza Doces"
  | "Bebida"
  | "Combos"
  | "Outro";

type Produto = {
  id: string;
  nome: string;
  descricao: string | null;
  categoria: Categoria;
  preco: number | string;
  imagem: string | null;
  ativo: boolean | string;
};

const categoriasMenu = ["Todos", "Pizza Salgadas", "Pizza Doces", "Bebida"] as const;

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

const Menu = () => {
  const [filtro, setFiltro] = useState<(typeof categoriasMenu)[number]>("Todos");
  const { addItem, items, total } = useCart();
  const navigate = useNavigate();

  const { data: produtos, isLoading, error } = useQuery({
    queryKey: ["produtos_menu"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("produtos")
        .select("*")
        .in("ativo", [true, "TRUE", "true"])
        .order("nome", { ascending: true });

      if (error) throw error;
      return data as Produto[];
    },
  });

  const produtosFiltrados =
    filtro === "Todos"
      ? produtos ?? []
      : (produtos ?? []).filter((p) => p.categoria === filtro);

  const quantidadeItens = items.reduce(
    (sum, item) => sum + item.quantidade,
    0
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 pb-24">
      <div className="mx-auto max-w-6xl px-4 pt-6 space-y-6">
        {/* 🔝 BARRA SUPERIOR: Voltar + Resumo do Carrinho */}
        <header className="flex items-center justify-between gap-3">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800/80 transition"
          >
            <span className="text-lg">←</span>
            Voltar
          </button>

          <div className="flex flex-col items-end text-right text-xs sm:text-sm">
            <span className="uppercase tracking-[0.25em] text-slate-400">
              Meu Carrinho
            </span>
            <div className="flex items-baseline gap-3 mt-1">
              <span className="text-slate-200">
                Itens:{" "}
                <span className="font-semibold">{quantidadeItens}</span>
              </span>
              <span className="text-slate-200">
                Total:{" "}
                <span className="font-semibold">
                  {formatCurrency(total)}
                </span>
              </span>
              <button
                onClick={() => navigate("/checkout")}
                className="ml-2 rounded-full bg-amber-400 px-4 py-1.5 text-xs sm:text-sm font-semibold text-slate-950 hover:bg-amber-300 transition"
              >
                Ir para checkout
              </button>
            </div>
          </div>
        </header>

        {/* TÍTULO PRINCIPAL */}
        <div className="text-center mt-2">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            Nosso Cardápio
          </p>
          <h1 className="mt-2 text-3xl md:text-4xl font-bold">
            Explore nossos sabores
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Escolha a categoria ou veja todos os itens disponíveis.
          </p>
        </div>

        {/* FILTRO POR CATEGORIA */}
        <div className="flex justify-center gap-3 flex-wrap mt-4">
          {categoriasMenu.map((cat) => (
            <button
              key={cat}
              onClick={() => setFiltro(cat)}
              className={`px-5 py-2 rounded-full text-sm transition font-semibold ${
                filtro === cat
                  ? "bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/30"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* LISTAGEM DE PRODUTOS / ESTADOS */}
        {isLoading ? (
          <p className="text-center text-slate-400 mt-10">
            Carregando produtos...
          </p>
        ) : error ? (
          <p className="text-center text-red-400 mt-10 text-sm">
            Erro ao carregar produtos.
          </p>
        ) : produtosFiltrados.length === 0 ? (
          <p className="text-center text-slate-400 mt-10">
            Nenhum produto encontrado nesta categoria.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-4">
            {produtosFiltrados.map((produto) => (
              <ProductCard
                key={produto.id}
                produto={produto}
                onAdd={() =>
                  addItem({
                    id: produto.id,
                    nome: produto.nome,
                    descricao: produto.descricao,
                    categoria: produto.categoria,
                    preco: Number(produto.preco),
                    imagem: produto.imagem,
                  })
                }
              />
            ))}
          </div>
        )}
      </div>

      {/* 🛒 BARRA FIXA DO CARRINHO NO MOBILE */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 border-t border-slate-800 px-4 py-3 flex items-center justify-between md:hidden">
        <div className="text-xs text-slate-300">
          <div>
            Itens:{" "}
            <span className="font-semibold">{quantidadeItens}</span>
          </div>
          <div>
            Total:{" "}
            <span className="font-semibold">
              {formatCurrency(total)}
            </span>
          </div>
        </div>
        <button
          onClick={() => navigate("/checkout")}
          className="rounded-full bg-amber-400 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-amber-300 transition"
        >
          Finalizar pedido
        </button>
      </div>
    </div>
  );
};

export default Menu;
