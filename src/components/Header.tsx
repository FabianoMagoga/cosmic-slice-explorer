import { useState } from "react";
import { Menu, X, ChevronDown, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import Cart from "@/components/Cart";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: "Início", href: "/", isRoute: true },
    { label: "Planetas", href: "#planetas", isRoute: false },
    { label: "Sobre", href: "/sobre", isRoute: true },
  ];

  const categorias = [
    { label: "Pizza Salgadas", value: "Pizza Salgadas" },
    { label: "Pizza Doces", value: "Pizza Doces" },
    { label: "Bebidas", value: "Bebida" },
  ];

  const handleNavigation = (item: typeof menuItems[0]) => {
    if (item.isRoute) {
      navigate(item.href);
      setIsMenuOpen(false);
    } else {
      if (location.pathname !== "/") {
        navigate("/");
        setTimeout(() => {
          const element = document.querySelector(item.href);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      } else {
        const element = document.querySelector(item.href);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
      setIsMenuOpen(false);
    }
  };

  const handleCategoriaClick = (categoria: string) => {
    navigate(`/menu?categoria=${encodeURIComponent(categoria)}`);
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Planetas das Pizzas
            </h2>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-6">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavigation(item)}
                className="text-foreground/80 hover:text-primary transition-colors font-medium"
              >
                {item.label}
              </button>
            ))}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-1">
                  Cardápio <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate("/menu")}>
                  Ver Tudo
                </DropdownMenuItem>
                {categorias.map((cat) => (
                  <DropdownMenuItem
                    key={cat.value}
                    onClick={() => handleCategoriaClick(cat.value)}
                  >
                    {cat.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/admin/login")}
              title="Acesso Administrativo"
            >
              <Shield className="h-5 w-5" />
            </Button>
            
            <Cart />
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <Cart />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 space-y-2 animate-in slide-in-from-top">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavigation(item)}
                className="block w-full text-left px-4 py-3 text-foreground/80 hover:text-primary hover:bg-accent/10 rounded-lg transition-colors font-medium"
              >
                {item.label}
              </button>
            ))}
            
            <div className="border-t border-border/40 pt-2 mt-2">
              <p className="px-4 py-2 text-sm font-semibold text-foreground">Cardápio</p>
              <button
                onClick={() => {
                  navigate("/menu");
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-3 text-foreground/80 hover:text-primary hover:bg-accent/10 rounded-lg transition-colors"
              >
                Ver Tudo
              </button>
              {categorias.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => handleCategoriaClick(cat.value)}
                  className="block w-full text-left px-4 py-3 text-foreground/80 hover:text-primary hover:bg-accent/10 rounded-lg transition-colors"
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="border-t border-border/40 pt-2 mt-2">
              <Button
                variant="outline"
                className="w-full mx-4"
                style={{ width: 'calc(100% - 2rem)' }}
                onClick={() => {
                  navigate("/admin/login");
                  setIsMenuOpen(false);
                }}
              >
                <Shield className="mr-2 h-4 w-4" />
                Acesso Administrativo
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
