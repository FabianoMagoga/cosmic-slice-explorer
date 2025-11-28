// src/pages/AdminCombos.tsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import AdminBackButton from "@/components/AdminBackButton";

const AdminCombos = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [imagem, setImagem] = useState("");

  // ============================
  // LISTAR COMBOS
  // ============================
  const { data: combos, isLoading } = useQuery({
    queryKey: ["combos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("combos")
        .select("*")
        .order("ativo", { ascending: false });

      if (error) {
        console.error(error);
        throw new Error("Erro ao carregar combos");
      }
      return data;
    },
  });

  // ============================
  // CRIAR COMBO
  // ============================
  const criarCombo = useMutation({
    mutationFn: async () => {
      if (!titulo || !preco) throw new Error("Preencha título e preço.");

      const { error } = await supabase.from("combos").insert({
        titulo,
        descricao,
        imagem: imagem || null,
        preco: Number(preco),
        ativo: true,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Combo criado com sucesso!", variant: "success" });
      setTitulo("");
      setDescricao("");
      setPreco("");
      setImagem("");
      queryClient.invalidateQueries(["combos"]);
    },
    onError: (err: any) => {
      toast({ title: "Erro ao criar combo", description: err.message, variant: "destructive" });
    },
  });

  // ============================
  // ALTERAR STATUS (ATIVAR/DESATIVAR)
  // ============================
  const toggleStatus = async (comboId: string, ativo: boolean) => {
    const { error } = await supabase
      .from("combos")
      .update({ ativo: !ativo })
      .eq("id", comboId);

    if (error) {
      toast({ title: "Erro ao atualizar status", variant: "destructive" });
    } else {
      toast({ title: "Status alterado!", variant: "success" });
      queryClient.invalidateQueries(["combos"]);
    }
  };

  // ============================
  // DELETAR COMBO
  // ============================
  const deletarCombo = async (comboId: string) => {
    const { error } = await supabase.from("combos").delete().eq("id", comboId);

    if (error) {
      toast({ title: "Erro ao deletar combo", variant: "destructive" });
    } else {
      toast({ title: "Combo removido!", variant: "success" });
      queryClient.invalidateQueries(["combos"]);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <AdminBackButton />

      <h1 className="text-3xl font-bold mb-6">Gerenciar Combos</h1>

      {/* ===================== FORMULÁRIO DE CRIAÇÃO ===================== */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Cadastrar Combo</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Input
            placeholder="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />

          <Textarea
            placeholder="Descrição (opcional)"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />

          <Input
            placeholder="Preço"
            value={preco}
            type="number"
            onChange={(e) => setPreco(e.target.value)}
          />

          <Input
            placeholder="URL da imagem (opcional)"
            value={imagem}
            onChange={(e) => setImagem(e.target.value)}
          />

          <Button onClick={() => criarCombo.mutate()} className="mt-2">
            Criar Combo
          </Button>
        </CardContent>
      </Card>

      {/* ===================== LISTAGEM DE COMBOS ===================== */}
      <h2 className="text-2xl font-semibold mb-4">Combos Cadastrados</h2>

      {isLoading && <p>Carregando combos...</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {combos?.map((combo) => (
          <Card key={combo.id} className="relative shadow-md">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {combo.titulo}

                <Switch
                  checked={combo.ativo}
                  onCheckedChange={() => toggleStatus(combo.id, combo.ativo)}
                />
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              {combo.imagem && (
                <img
                  src={combo.imagem}
                  alt={combo.titulo}
                  className="w-full h-40 object-cover rounded-lg"
                />
              )}

              <p className="text-sm opacity-80">{combo.descricao}</p>
              <p className="font-bold text-lg">R$ {combo.preco}</p>

              <Button
                variant="destructive"
                onClick={() => deletarCombo(combo.id)}
                className="w-full mt-2"
              >
                Deletar
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminCombos;
