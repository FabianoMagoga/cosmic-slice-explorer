// src/pages/AdminProdutos.tsx
import { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import AdminBackButton from "@/components/AdminBackButton";
import { useToast } from "@/hooks/use-toast";

type Categoria =
  | "Pizza Salgadas"
  | "Pizza Doces"
  | "Bebida"
  | "Combos"
  | "Outro";

type Produto = {
  id: string;
  nome: string;
  descricao: string | null;
  categoria: Categoria;
  preco: number;
  imagem: string | null;
  ativo: boolean;
};

const categorias: Categoria[] = [
  "Pizza Salgadas",
  "Pizza Doces",
  "Bebida",
  "Combos",
  "Outro",
];

const AdminProdutos = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [form, setForm] = useState<{
    id?: string;
    nome: string;
    descricao: string;
    categoria: Categoria;
    preco: string;
    imagem: string;
    ativo: boolean;
  }>({
    nome: "",
    descricao: "",
    categoria: "Pizza Salgadas",
    preco: "",
    imagem: "",
    ativo: true,
  });

  const isEdit = !!form.id;

  const { data, isLoading } = useQuery({
    queryKey: ["produtos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("produtos")
        .select("*")
        .order("nome", { ascending: true });

      if (error) throw error;
      return data as Produto[];
    },
  });

  const resetForm = () => {
    setForm({
      id: undefined,
      nome: "",
      descricao: "",
      categoria: "Pizza Salgadas",
      preco: "",
      imagem: "",
      ativo: true,
    });
  };

  const salvarMutation = useMutation({
    mutationFn: async (payload: typeof form) => {
      const precoNumber = Number(payload.preco || 0);

      if (!payload.nome.trim()) {
        throw new Error("Informe o nome do produto.");
      }
      if (Number.isNaN(precoNumber) || precoNumber <= 0) {
        throw new Error("Preço inválido.");
      }

      const baseData = {
        nome: payload.nome.trim(),
        descricao: payload.descricao.trim() || null,
        categoria: payload.categoria,
        preco: precoNumber,
        imagem: payload.imagem.trim() || null,
        ativo: payload.ativo,
      };

      if (payload.id) {
        const { error } = await supabase
          .from("produtos")
          .update(baseData)
          .eq("id", payload.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("produtos").insert(baseData);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Produto salvo",
        description: "O produto foi salvo com sucesso.",
      });
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["produtos"] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao salvar",
        description: error.message ?? "Verifique os dados e tente novamente.",
        variant: "destructive",
      });
    },
  });

  const deletarMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("produtos")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Produto removido",
        description: "O produto foi removido com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ["produtos"] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao remover",
        description: error.message ?? "Tente novamente em instantes.",
        variant: "destructive",
      });
    },
  });

  // 🔁 Toggle ATIVO / INATIVO
  const toggleAtivoMutation = useMutation({
    mutationFn: async (payload: { id: string; ativo: boolean }) => {
      const { error } = await supabase
        .from("produtos")
        .update({ ativo: payload.ativo })
        .eq("id", payload.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Status atualizado",
        description: "O status do produto foi atualizado.",
      });
      queryClient.invalidateQueries({ queryKey: ["produtos"] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar status",
        description: error.message ?? "Tente novamente em instantes.",
        variant: "destructive",
      });
    },
  });

  const handleEditar = (produto: Produto) => {
    setForm({
      id: produto.id,
      nome: produto.nome,
      descricao: produto.descricao ?? "",
      categoria: produto.categoria,
      preco: String(produto.preco),
      imagem: produto.imagem ?? "",
      ativo: produto.ativo,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-6">
        {/* HEADER */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
              Administração
            </p>
            <h1 className="text-2xl font-semibold">Produtos</h1>
            <p className="text-xs text-slate-400">
              Gerencie pizzas, bebidas e outros itens do cardápio.
            </p>
          </div>

          <AdminBackButton />
        </div>

        {/* FORMULÁRIO */}
        <Card className="mb-6 bg-slate-900/80 border-slate-800">
          <CardHeader>
            <CardTitle>
              {isEdit ? "Editar produto" : "Novo produto"}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Nome */}
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  value={form.nome}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, nome: e.target.value }))
                  }
                  placeholder="Ex: Pizza Calabresa"
                />
              </div>

              {/* Categoria */}
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria</Label>
                <select
                  id="categoria"
                  className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-900 px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500"
                  value={form.categoria}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      categoria: e.target.value as Categoria,
                    }))
                  }
                >
                  {categorias.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Preço */}
              <div className="space-y-2">
                <Label htmlFor="preco">Preço (R$)</Label>
                <Input
                  id="preco"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.preco}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, preco: e.target.value }))
                  }
                  placeholder="Ex: 59.90"
                />
              </div>

              {/* Imagem */}
              <div className="space-y-2">
                <Label htmlFor="imagem">URL da imagem (opcional)</Label>
                <Input
                  id="imagem"
                  value={form.imagem}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, imagem: e.target.value }))
                  }
                  placeholder="https://..."
                />
              </div>
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <textarea
                id="descricao"
                className="min-h-[80px] w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500"
                value={form.descricao}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, descricao: e.target.value }))
                }
                placeholder="Ex: Molho de tomate, mussarela, calabresa..."
              />
            </div>

            {/* Ativo */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch
                  id="ativo"
                  checked={form.ativo}
                  onCheckedChange={(checked) =>
                    setForm((prev) => ({ ...prev, ativo: checked }))
                  }
                />
                <Label htmlFor="ativo">Produto ativo no cardápio</Label>
              </div>

              <div className="flex gap-2">
                {isEdit && (
                  <Button
                    variant="outline"
                    type="button"
                    onClick={resetForm}
                    disabled={salvarMutation.isPending}
                  >
                    Cancelar edição
                  </Button>
                )}

                <Button
                  type="button"
                  onClick={() => salvarMutation.mutate(form)}
                  disabled={salvarMutation.isPending}
                >
                  {salvarMutation.isPending
                    ? "Salvando..."
                    : isEdit
                    ? "Salvar alterações"
                    : "Cadastrar produto"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* LISTA DE PRODUTOS */}
        <Card className="bg-slate-900/80 border-slate-800">
          <CardHeader>
            <CardTitle>Produtos cadastrados</CardTitle>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <p className="text-sm text-slate-400">
                Carregando produtos...
              </p>
            ) : !data || data.length === 0 ? (
              <p className="text-sm text-slate-400">
                Nenhum produto cadastrado ainda.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead>Ativo</TableHead>
                    <TableHead className="w-[220px] text-right">
                      Ações
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {data.map((produto) => (
                    <TableRow key={produto.id}>
                      <TableCell>{produto.nome}</TableCell>
                      <TableCell>{produto.categoria}</TableCell>
                      <TableCell>
                        R$ {Number(produto.preco).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={
                            produto.ativo
                              ? "rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-400"
                              : "rounded-full bg-slate-500/15 px-2 py-0.5 text-xs text-slate-400"
                          }
                        >
                          {produto.ativo ? "Ativo" : "Inativo"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {/* Ativar / desativar */}
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() =>
                              toggleAtivoMutation.mutate({
                                id: produto.id,
                                ativo: !produto.ativo,
                              })
                            }
                          >
                            {produto.ativo ? "Desativar" : "Ativar"}
                          </Button>

                          {/* Editar */}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditar(produto)}
                          >
                            Editar
                          </Button>

                          {/* Remover */}
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              deletarMutation.mutate(produto.id)
                            }
                          >
                            Remover
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminProdutos;
