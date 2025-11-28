// src/components/ProductCard.tsx
import { Button } from "@/components/ui/button";

type Produto = {
  id: string;
  nome: string;
  descricao?: string | null;
  categoria?: string | null;
  preco: number | string;
  imagem?: string | null;
};

type ProductCardProps = {
  produto: Produto;
  onAdd: () => void;
};

const ProductCard = ({ produto, onAdd }: ProductCardProps) => {
  const precoNumero = Number(produto.preco || 0);

  return (
    <div className="rounded-xl bg-slate-900/70 border border-slate-800 p-4 flex flex-col gap-3 shadow-lg">
      {produto.imagem && (
        <img
          src={produto.imagem}
          alt={produto.nome}
          className="w-full h-40 object-cover rounded-lg"
        />
      )}

      <h2 className="text-lg font-semibold">{produto.nome}</h2>

      {produto.descricao && (
        <p className="text-sm text-slate-400 line-clamp-2">
          {produto.descricao}
        </p>
      )}

      <div className="flex items-center justify-between mt-2">
        <span className="text-amber-400 text-xl font-bold">
          R$ {precoNumero.toFixed(2)}
        </span>

        <Button
          className="bg-amber-500 hover:bg-amber-400 text-slate-900"
          onClick={onAdd}
        >
          Adicionar ao Pedido
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
