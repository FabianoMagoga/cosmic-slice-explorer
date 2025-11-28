// src/pages/Index.tsx
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import PlanetsSection from "@/components/PlanetsSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      {/* Navbar */}
      <Header />

      {/* Conteúdo principal */}
      <main className="flex-1">
        <Hero />
        <PlanetsSection />
      </main>

      {/* Rodapé */}
      <Footer />
    </div>
  );
};

export default Index;
