import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Mail, MapPin, Clock, Instagram, Facebook } from "lucide-react";

const Sobre = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-24">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Sobre o Planetas das Pizzas
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Uma viagem gastronômica que começou há anos e continua conquistando paladares em toda a galáxia
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          {/* Nossa História */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/40">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-primary">
                🌟 Nossa História
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p className="text-lg leading-relaxed">
                O <span className="text-primary font-semibold">Planetas das Pizzas</span> nasceu da paixão pela gastronomia e do sonho de criar um lugar onde cada pizza é uma experiência única. Inspirados pela imensidão do cosmos, criamos um cardápio que orbita ao redor do sabor, da qualidade e da criatividade.
              </p>
              <p className="text-lg leading-relaxed">
                Cada receita é cuidadosamente elaborada com ingredientes selecionados, massa artesanal e muito amor. Nossa missão é levar felicidade através de sabores que explodem como estrelas no seu paladar.
              </p>
              <p className="text-lg leading-relaxed">
                Aqui, o sabor é tão grande quanto o próprio cosmos! 🍕✨
              </p>
            </CardContent>
          </Card>

          {/* Contatos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-card/50 backdrop-blur-sm border-border/40 hover:border-primary/50 transition-all">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
                  <Phone className="w-6 h-6" />
                  Telefones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">WhatsApp / Pedidos</p>
                  <a href="tel:+5511999999999" className="text-lg font-semibold text-foreground hover:text-primary transition-colors">
                    (11) 99999-9999
                  </a>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Telefone Fixo</p>
                  <a href="tel:+551133333333" className="text-lg font-semibold text-foreground hover:text-primary transition-colors">
                    (11) 3333-3333
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/40 hover:border-primary/50 transition-all">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
                  <Mail className="w-6 h-6" />
                  Email
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Atendimento ao Cliente</p>
                  <a href="mailto:contato@universodapizza.com.br" className="text-lg font-semibold text-foreground hover:text-primary transition-colors break-all">
                    contato@universodapizza.com.br
                  </a>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Parcerias</p>
                  <a href="mailto:parcerias@universodapizza.com.br" className="text-lg font-semibold text-foreground hover:text-primary transition-colors break-all">
                    parcerias@universodapizza.com.br
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/40 hover:border-primary/50 transition-all">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
                  <MapPin className="w-6 h-6" />
                  Endereço
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-lg font-semibold text-foreground">
                    Rua das Galáxias, 1234
                  </p>
                  <p className="text-muted-foreground">
                    Bairro Cósmico - São Paulo, SP
                  </p>
                  <p className="text-muted-foreground">
                    CEP: 01234-567
                  </p>
                </div>
                <a 
                  href="https://maps.google.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block text-primary hover:text-accent transition-colors font-semibold"
                >
                  Ver no mapa →
                </a>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border/40 hover:border-primary/50 transition-all">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
                  <Clock className="w-6 h-6" />
                  Horário de Funcionamento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Segunda a Quinta</span>
                  <span className="font-semibold text-foreground">18h - 23h30</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sexta e Sábado</span>
                  <span className="font-semibold text-foreground">18h - 00h30</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Domingo</span>
                  <span className="font-semibold text-foreground">18h - 23h</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Redes Sociais */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/40">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-primary text-center">
                Siga-nos nas Redes Sociais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center gap-6">
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full hover:scale-105 transition-transform font-semibold"
                >
                  <Instagram className="w-5 h-5" />
                  Instagram
                </a>
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full hover:scale-105 transition-transform font-semibold"
                >
                  <Facebook className="w-5 h-5" />
                  Facebook
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Sobre;
