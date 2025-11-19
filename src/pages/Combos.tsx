import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

interface Produto {
  id: string;
  nome: string;
  preco: number;
  categoria: string;
}

interface Combo {
  id: string;
  nome: string;
  descricao: string;
  produtos: string[];
  preco_original: number;
  preco_combo: number;
  desconto_percentual: number;
}

const Combos = () => {
  const [combos] = useState<Combo[]>([
    {
      id: "combo-1",
      nome: "Combo Família Galáctica",
      descricao: "2 Pizzas Grandes + 2 Refrigerantes 2L",
      produtos: ["pizza-grande-1", "pizza-grande-2", "refri-2l-1", "refri-2l-2"],
      preco_original: 140.00,
      preco_combo: 115.00,
      desconto_percentual: 18
    },
    {
      id: "combo-2",
      nome: "Combo Dupla Estelar",
      descricao: "1 Pizza Grande Salgada + 1 Pizza Doce + 2 Refrigerantes 1L",
      produtos: ["pizza-salgada", "pizza-doce", "refri-1l-1", "refri-1l-2"],
      preco_original: 120.00,
      preco_combo: 99.00,
      desconto_percentual: 18
    },
    {
      id: "combo-3",
      nome: "Combo Casal Cósmico",
      descricao: "1 Pizza Grande + 2 Refrigerantes Lata",
      produtos: ["pizza-grande", "refri-lata-1", "refri-lata-2"],
      preco_original: 75.00,
      preco_combo: 65.00,
      desconto_percentual: 13
    },
    {
      id: "combo-4",
      nome: "Combo Solitário Sideral",
      descricao: "1 Pizza Média + 1 Refrigerante 600ml",
      produtos: ["pizza-media", "refri-600ml"],
      preco_original: 55.00,
      preco_combo: 48.00,
      desconto_percentual: 13
    }
  ]);

  const { addItem } = useCart();
  const navigate = useNavigate();

  const handleAddCombo = (combo: Combo) => {
    // Adiciona o combo como um item especial no carrinho
    addItem({
      id: combo.id,
      nome: combo.nome,
      categoria: "Combo" as any,
      preco: combo.preco_combo,
    });
    
    toast.success(`${combo.nome} adicionado ao carrinho!`);
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-24">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            🪐 Saturno - Combos Especiais
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Economize mais pedindo nossos combos especiais! Perfeitos para compartilhar em qualquer galáxia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {combos.map((combo) => (
            <Card 
              key={combo.id}
              className="group hover:scale-105 transition-all duration-300 bg-card/50 backdrop-blur-sm border-border/40 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {combo.nome}
                  </CardTitle>
                  <div className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-bold">
                    -{combo.desconto_percentual}%
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-muted-foreground mb-4">{combo.descricao}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground line-through">
                      De: R$ {combo.preco_original.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-foreground">Por:</span>
                    <span className="text-3xl font-bold text-primary">
                      R$ {combo.preco_combo.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-sm text-accent font-semibold">
                    Economia de R$ {(combo.preco_original - combo.preco_combo).toFixed(2)}
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
                  size="lg"
                  onClick={() => handleAddCombo(combo)}
                >
                  Adicionar Combo ao Pedido
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

export default Combos;
