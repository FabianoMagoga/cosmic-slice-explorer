// src/contexts/CartContext.tsx
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

export type Produto = {
  id: string;
  nome: string;
  descricao?: string | null;
  categoria?: string | null;
  preco: number;
  imagem?: string | null;
};

export type CartItem = Produto & {
  quantidade: number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (produto: Produto) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  total: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("planet-pizza-cart");
      return saved ? (JSON.parse(saved) as CartItem[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("planet-pizza-cart", JSON.stringify(items));
  }, [items]);

  const addItem = (produto: Produto) => {
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.id === produto.id);
      if (idx >= 0) {
        const clone = [...prev];
        clone[idx] = {
          ...clone[idx],
          quantidade: clone[idx].quantidade + 1,
        };
        return clone;
      }
      return [...prev, { ...produto, quantidade: 1 }];
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce(
    (sum, item) => sum + item.preco * item.quantidade,
    0
  );

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, clearCart, total }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
};
