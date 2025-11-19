import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Copy, Check, Clock, Tag } from "lucide-react";

interface Promocao {
  id: string;
  codigo: string;
  titulo: string;
  descricao: string;
  desconto: string;
  validade: string;
  categoria: "Todas" | "Pizza Salgadas" | "Pizza Doces" | "Bebida";
  ativo: boolean;
}

const Promocoes = () => {
  const [copiado, setCopiado] = useState<string | null>(null);
  const navigate = useNavigate();

  const [promocoes] = useState<Promocao[]>([
    {
      id: "promo-1",
      codigo: "PRIMEIRA10",
      titulo: "10% OFF na Primeira Compra",
      descricao: "Ganhe 10% de desconto na sua primeira viagem pelo nosso universo gastronômico!",
      desconto: "10% OFF",
      validade: "31/12/2024",
      categoria: "Todas",
      ativo: true
    },
    {
      id: "promo-2",
      codigo: "PIZZA2X",
      titulo: "Leve 2 Pague 1.5",
      descricao: "Na compra de 2 pizzas, ganhe 50% de desconto na segunda pizza!",
      desconto: "50% na 2ª",
      validade: "30/11/2024",
      categoria: "Pizza Salgadas",
      ativo: true
    },
    {
      id: "promo-3",
      codigo: "DOCE15",
      titulo: "Doce Desconto",
      descricao: "15% de desconto em todas as pizzas doces. Perfeito para sobremesa!",
      desconto: "15% OFF",
      validade: "31/12/2024",
      categoria: "Pizza Doces",
      ativo: true
    },
    {
      id: "promo-4",
      codigo: "FRETEGRATIS",
      titulo: "Frete Grátis",
      descricao: "Delivery grátis para pedidos acima de R$ 60,00 em toda a galáxia!",
      desconto: "Frete Grátis",
      validade: "31/12/2024",
      categoria: "Todas",
      ativo: true
    },
    {
      id: "promo-5",
      codigo: "COMBO20",
      titulo: "Combo em Dobro",
      descricao: "20% de desconto em todos os combos! Economize ainda mais!",
      desconto: "20% OFF",
      validade: "15/12/2024",
      categoria: "Todas",
      ativo: true
    }
  ]);

  const copiarCodigo = (codigo: string) => {
    navigator.clipboard.writeText(codigo);
    setCopiado(codigo);
    toast.success("Código copiado!");
    
    setTimeout(() => {
      setCopiado(null);
    }, 2000);
  };

  const getCategoriaColor = (categoria: string) => {
    switch (categoria) {
      case "Pizza Salgadas": return "bg-blue-500/20 text-blue-300 border-blue-500/50";
      case "Pizza Doces": return "bg-pink-500/20 text-pink-300 border-pink-500/50";
      case "Bebida": return "bg-yellow-500/20 text-yellow-300 border-yellow-500/50";
      default: return "bg-purple-500/20 text-purple-300 border-purple-500/50";
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-24">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            ☿️ Mercúrio - Promoções Relâmpago
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Cupons e promoções que passam como cometas! Aproveite antes que desapareçam no espaço.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {promocoes.filter(p => p.ativo).map((promo) => (
            <Card 
              key={promo.id}
              className="group hover:scale-105 transition-all duration-300 bg-card/50 backdrop-blur-sm border-border/40 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/20"
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge className={getCategoriaColor(promo.categoria)}>
                    <Tag className="w-3 h-3 mr-1" />
                    {promo.categoria}
                  </Badge>
                  <div className="bg-accent/20 text-accent px-3 py-1 rounded-full text-sm font-bold">
                    {promo.desconto}
                  </div>
                </div>
                
                <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {promo.titulo}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm">
                  {promo.descricao}
                </p>
                
                <div className="bg-muted/50 p-3 rounded-lg border border-border/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Código do Cupom</p>
                      <p className="font-mono font-bold text-primary text-lg">
                        {promo.codigo}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copiarCodigo(promo.codigo)}
                      className="hover:bg-primary/20"
                    >
                      {copiado === promo.codigo ? (
                        <Check className="w-4 h-4 text-accent" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Válido até {promo.validade}</span>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
                  onClick={() => navigate('/menu')}
                >
                  Usar Cupom
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Promocoes;
