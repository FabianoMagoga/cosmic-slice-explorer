import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

// Pizzas Salgadas
import quatroQueijosImg from "@/assets/pizzas/4-queijos.jpg";
import cincoQueijosImg from "@/assets/pizzas/5-queijos.jpg";
import americanaImg from "@/assets/pizzas/americana.jpg";
import atumImg from "@/assets/pizzas/atum.jpg";
import brocolisImg from "@/assets/pizzas/brocolis.jpg";
import calabresaImg from "@/assets/pizzas/calabresa.jpg";
import calabresaCheddarImg from "@/assets/pizzas/calabresa-cheddar.jpg";
import calabresaQueijoImg from "@/assets/pizzas/calabresa-queijo.jpg";
import chicagoImg from "@/assets/pizzas/chicago.jpg";
import doritosImg from "@/assets/pizzas/doritos.jpg";
import frangoBaconImg from "@/assets/pizzas/frango-bacon.jpg";
import frangoCatupiry from "@/assets/pizzas/frango-catupiry.jpg";
import frangoCatupirBaconImg from "@/assets/pizzas/frango-catupiry-bacon.jpg";
import frangoCheddarImg from "@/assets/pizzas/frango-cheddar.jpg";
import laBonissimaImg from "@/assets/pizzas/la-bonissima.jpg";
import modaCasaImg from "@/assets/pizzas/moda-casa.jpg";
import modaChefeImg from "@/assets/pizzas/moda-chefe.jpg";
import mussarelaImg from "@/assets/pizzas/mussarela.jpg";
import portuguesaImg from "@/assets/pizzas/portuguesa.jpg";
import strogonoffImg from "@/assets/pizzas/strogonoff.jpg";
import toscanaImg from "@/assets/pizzas/toscana.jpg";

// Pizzas Doces
import bananaCaramelizadaImg from "@/assets/pizzas/banana-caramelizada.jpg";
import beijinhoImg from "@/assets/pizzas/beijinho.jpg";
import chocolateImg from "@/assets/pizzas/chocolate.jpg";
import chocolateBananaImg from "@/assets/pizzas/chocolate-banana.jpg";
import chocolateMorangoImg from "@/assets/pizzas/chocolate-morango.jpg";
import confeteImg from "@/assets/pizzas/confete.jpg";
import creamCookiesImg from "@/assets/pizzas/cream-cookies.jpg";
import doceLeiteImg from "@/assets/pizzas/doce-leite.jpg";
import prestigioImg from "@/assets/pizzas/prestigio.jpg";
import romeuJulietaImg from "@/assets/pizzas/romeu-julieta.jpg";

// Bebidas
import aguaMineral500mlImg from "@/assets/bebidas/agua-mineral-500ml.jpg";
import cerveja600mlImg from "@/assets/bebidas/cerveja-600ml.jpg";
import cervejaLataImg from "@/assets/bebidas/cerveja-lata.jpg";
import cervejaLongNeckImg from "@/assets/bebidas/cerveja-long-neck.jpg";
import refrigerante1lImg from "@/assets/bebidas/refrigerante-1l.jpg";
import refrigerante2lImg from "@/assets/bebidas/refrigerante-2l.jpg";
import refrigerante600mlImg from "@/assets/bebidas/refrigerante-600ml.jpg";
import refrigeranteLataImg from "@/assets/bebidas/refrigerante-lata.jpg";
import suco300mlImg from "@/assets/bebidas/suco-300ml.jpg";

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
    // Mapeamento completo de nomes de produtos para imagens específicas
    const imageMap: Record<string, string> = {
      // Pizzas Salgadas
      "4 Queijos": quatroQueijosImg,
      "5 Queijos": cincoQueijosImg,
      "Americana": americanaImg,
      "Atum": atumImg,
      "Brocolis": brocolisImg,
      "Calabresa": calabresaImg,
      "Calabresa com Cheddar": calabresaCheddarImg,
      "Calabresa com Queijo": calabresaQueijoImg,
      "Chicago": chicagoImg,
      "Doritos": doritosImg,
      "Frango com Bacon": frangoBaconImg,
      "Frango com Catupiry": frangoCatupiry,
      "Frango com Catupiry e Bacon": frangoCatupirBaconImg,
      "Frango com Cheddar": frangoCheddarImg,
      "La Bonissima": laBonissimaImg,
      "Moda da Casa": modaCasaImg,
      "Moda do Chefe": modaChefeImg,
      "Mussarela": mussarelaImg,
      "Portuguesa": portuguesaImg,
      "Strogonoff": strogonoffImg,
      "Toscana": toscanaImg,
      
      // Pizzas Doces
      "Pizza Doces (Banana Caramelizada)": bananaCaramelizadaImg,
      "Pizza Doces (Beijinho)": beijinhoImg,
      "Pizza Doces (Chocolate)": chocolateImg,
      "Pizza Doces (Chocolate com Banana)": chocolateBananaImg,
      "Pizza Doces (Chocolate com Morango)": chocolateMorangoImg,
      "Pizza Doces (Confete)": confeteImg,
      "Pizza Doces (Cream Cookies)": creamCookiesImg,
      "Pizza Doces (Doce de Leite)": doceLeiteImg,
      "Pizza Doces (Prestigio)": prestigioImg,
      "Pizza Doces (Romeu e Julieta)": romeuJulietaImg,

      // Bebidas
      "Agua Mineral 500ml": aguaMineral500mlImg,
      "Cerveja 600ml": cerveja600mlImg,
      "Cerveja Lata": cervejaLataImg,
      "Cerveja Long Neck": cervejaLongNeckImg,
      "Refrigerante 1L": refrigerante1lImg,
      "Refrigerante 2L": refrigerante2lImg,
      "Refrigerante 600ml": refrigerante600mlImg,
      "Refrigerante Lata": refrigeranteLataImg,
      "Suco 300ml - Sabores": suco300mlImg,
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
