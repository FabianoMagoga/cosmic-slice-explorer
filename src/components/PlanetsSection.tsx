import PlanetCard from "./PlanetCard";

const PlanetsSection = () => {
  const planets = [
    {
      icon: "🌍",
      name: "Terra",
      description: "O planeta das pizzas salgadas, onde os ingredientes se unem em perfeita harmonia.",
      planetColor: "hsl(210 70% 55%)",
      delay: "0s",
      category: "Pizza Salgadas"
    },
    {
      icon: "🔴",
      name: "Marte",
      description: "Lar das pizzas doces, criadas para quem ama aventuras açucaradas.",
      planetColor: "hsl(15 85% 60%)",
      delay: "0.2s",
      category: "Pizza Doces"
    },
    {
      icon: "🪐",
      name: "Saturno",
      description: "O reino dos combos especiais, perfeitos para compartilhar em qualquer galáxia.",
      planetColor: "hsl(45 75% 65%)",
      delay: "0.4s",
      route: "/combos"
    },
    {
      icon: "🌕",
      name: "Júpiter",
      description: "Gigante das bebidas, refrescantes como um mergulho no espaço sideral.",
      planetColor: "hsl(35 70% 58%)",
      delay: "0.6s",
      category: "Bebida"
    },
    {
      icon: "🌑",
      name: "Mercúrio",
      description: "O planeta mais veloz, cheio de cupons e promoções que passam como cometas!",
      planetColor: "hsl(0 70% 65%)",
      delay: "0.8s",
      route: "/promocoes"
    }
  ];

  return (
    <section id="planetas" className="py-20 px-4 relative">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-400 bg-clip-text text-transparent">
            Nossos Planetas
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore cada mundo de sabores em nosso sistema solar gastronômico
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {planets.map((planet, index) => (
            <div key={planet.name} className="animate-float" style={{ animationDelay: planet.delay }}>
              <PlanetCard {...planet} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlanetsSection;
