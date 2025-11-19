import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

// Importar imagens específicas de pizzas
import quatroQueijosImg from "@/assets/pizzas/4-queijos.jpg";
import calabresaImg from "@/assets/pizzas/calabresa.jpg";
import frangoCatupiry from "@/assets/pizzas/frango-catupiry.jpg";
import mussarelaImg from "@/assets/pizzas/mussarela.jpg";
import portuguesaImg from "@/assets/pizzas/portuguesa.jpg";
import chocolateImg from "@/assets/pizzas/chocolate.jpg";
import chocolateMorangoImg from "@/assets/pizzas/chocolate-morango.jpg";
import bananaCaramelizadaImg from "@/assets/pizzas/banana-caramelizada.jpg";
import calabresaCheddarImg from "@/assets/pizzas/calabresa-cheddar.jpg";
import frangoBaconImg from "@/assets/pizzas/frango-bacon.jpg";

// Imagens genéricas de fallback
import pizzaSalgadaImg from "@/assets/pizza-salgada.jpg";
import pizzaDoceImg from "@/assets/pizza-doce.jpg";
import bebidaImg from "@/assets/bebida.jpg";

type Produto = {
  id: string;
  nome: string;
  categoria: "Pizza Salgadas" | "Pizza Doces" | "Bebida";
  preco: number;
};

interface ProductCardProps {
  produto: Produto;
}

const ProductCard = ({ produto }: ProductCardProps) => {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    console.log("Botão clicado - tentando adicionar produto:", produto);
    addItem(produto);
  };

  const getImage = () => {
    // Mapeamento de nomes de produtos para imagens específicas
    const imageMap: Record<string, string> = {
      "4 Queijos": quatroQueijosImg,
      "Calabresa": calabresaImg,
      "Calabresa com Cheddar": calabresaCheddarImg,
      "Frango com Catupiry": frangoCatupiry,
      "Frango com Bacon": frangoBaconImg,
      "Mussarela": mussarelaImg,
      "Portuguesa": portuguesaImg,
      "Pizza Doces (Chocolate)": chocolateImg,
      "Pizza Doces (Chocolate com Morango)": chocolateMorangoImg,
      "Pizza Doces (Banana Caramelizada)": bananaCaramelizadaImg,
    };

    // Primeiro tenta encontrar imagem específica pelo nome exato
    if (imageMap[produto.nome]) {
      return imageMap[produto.nome];
    }

    // Se não encontrar, usa imagem genérica por categoria
    switch (produto.categoria) {
      case "Pizza Salgadas":
        return pizzaSalgadaImg;
      case "Pizza Doces":
        return pizzaDoceImg;
      case "Bebida":
        return bebidaImg;
      default:
        return pizzaSalgadaImg;
    }
  };

  return (
    <Card className="group hover:scale-105 transition-all duration-300 bg-card/50 backdrop-blur-sm border-border/40 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col">
          <div className="relative w-full h-48 overflow-hidden">
            <img 
              src={getImage()} 
              alt={produto.nome}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <div className="p-6 text-center">
            <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
              {produto.nome}
            </h3>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-center space-y-3">
        <div className="text-3xl font-bold text-primary">
          R$ {produto.preco.toFixed(2)}
        </div>
        <Button 
          className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
          size="lg"
          onClick={handleAddToCart}
        >
          Adicionar ao Pedido
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
